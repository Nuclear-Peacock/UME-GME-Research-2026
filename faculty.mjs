import { PATHWAYS } from './data/pathways.mjs';
import { PROJECT_TRACKING_DEFAULTS, projectAvailability, signupLabel, spotsLabel } from './data/availability.mjs';

const byId = id => document.getElementById(id);
const login = byId('login');
const editor = byId('editor');
const notice = byId('notice');
const dashboard = byId('dashboard');
let token = '';
let editing = null;
let busy = false;

function element(tag, value) {
  const node = document.createElement(tag);
  node.textContent = value;
  return node;
}

for (const {key, label} of PATHWAYS) {
  editor.elements.accentKey.add(new Option(label, key));
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'tags';
  checkbox.value = key;
  wrapper.append(checkbox, label);
  byId('pathways').append(wrapper);
}

async function api(resource, method = 'GET', data) {
  const response = await fetch('/api/faculty/' + resource, {
    method,
    headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
    body: data && JSON.stringify(data),
    cache: 'no-store'
  });
  const result = await response.json();
  if (response.status === 401) signOut();
  if (!response.ok) throw new Error(result.error || 'Request failed.');
  return result;
}

function renderProjects(projects, submissions) {
  const interestedByProject = new Map();
  for (const submission of submissions) {
    for (const {id} of submission.projects) {
      if (!interestedByProject.has(id)) interestedByProject.set(id, new Set());
      interestedByProject.get(id).add(submission.email.toLowerCase());
    }
  }
  byId('projects').replaceChildren(...projects.map(project => {
    project = {...PROJECT_TRACKING_DEFAULTS, ...project};
    const entry = element('article', '');
    entry.className = 'entry';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = project.completed;
    const label = document.createElement('label');
    label.append(checkbox, ' Completed');
    checkbox.addEventListener('change', () => {
      const completed = checkbox.checked;
      if (busy) {
        checkbox.checked = project.completed;
        return;
      }
      run(async () => {
        try {
          await api('projects', 'PUT', {id: project.id, revision: project.revision, completed});
        } catch (error) {
          checkbox.checked = project.completed;
          throw error;
        }
        notice.textContent = completed ? 'Project marked complete.' : 'Project reopened.';
        await refresh();
      });
    });
    const edit = element('button', 'Edit');
    edit.className = 'btn';
    edit.addEventListener('click', () => openEditor(project));
    const actions = element('div', '');
    actions.className = 'actions';
    actions.append(label, edit);
    const {signupStatus, remainingSpots} = projectAvailability(project);
    const confirmed = project.capacity === null ? String(project.confirmedSpots) : project.confirmedSpots + ' / ' + project.capacity;
    const interested = interestedByProject.get(project.id)?.size ?? 0;
    const completion = project.completed ? 100 : project.completionPercent;
    const summary = element('p', [signupLabel(signupStatus), spotsLabel(remainingSpots),
      confirmed + ' confirmed', interested + ' interested', completion + '% complete'].join(' · '));
    entry.append(element('h3', project.title), summary, actions);
    return entry;
  }));
}

function renderInterests(submissions) {
  const rows = submissions.map(submission => {
    const entry = element('article', '');
    entry.className = 'entry';
    const list = document.createElement('ul');
    for (const project of submission.projects) list.append(element('li', project.title));
    entry.append(element('h3', submission.name), element('p', submission.email),
      element('p', new Date(submission.submittedAt).toLocaleString()), list);
    return entry;
  });
  byId('interests').replaceChildren(...(rows.length ? rows : [element('p', 'No student submissions yet.')]));
}

async function refresh() {
  const [projects, submissions] = await Promise.all([api('projects'), api('interests')]);
  renderProjects(projects, submissions);
  renderInterests(submissions);
}

async function run(action) {
  if (busy) return;
  busy = true;
  notice.textContent = '';
  try {
    await action();
  } catch (error) {
    notice.textContent = error.message;
  } finally {
    busy = false;
  }
}

function signOut() {
  token = '';
  dashboard.hidden = true;
  login.hidden = false;
  byId('projects').replaceChildren();
  byId('interests').replaceChildren();
  closeEditor();
}

function closeEditor() {
  editing = null;
  editor.reset();
  editor.hidden = true;
}

function openEditor(project = null) {
  if (busy) return;
  closeEditor();
  editing = project;
  byId('editorHeading').textContent = project ? 'Edit project' : 'New project';
  if (project) {
    for (const name of ['title', 'hook', 'status', 'why', 'role', 'output', 'timeline', 'accentKey', 'capacity', 'confirmedSpots', 'completionPercent']) {
      editor.elements[name].value = project[name] ?? '';
    }
    editor.elements.signupOpen.checked = project.signupOpen;
    for (const name of ['skills', 'badges']) editor.elements[name].value = project[name].join('\n');
    for (const checkbox of editor.querySelectorAll('[name=tags]')) checkbox.checked = project.tags.includes(checkbox.value);
  }
  editor.hidden = false;
  editor.elements.title.focus();
}

login.addEventListener('submit', event => {
  event.preventDefault();
  run(async () => {
    token = login.elements.token.value.trim();
    login.reset();
    await refresh();
    login.hidden = true;
    dashboard.hidden = false;
  });
});
byId('logout').addEventListener('click', () => {
  if (busy) return;
  signOut();
  notice.textContent = 'Signed out.';
});
byId('refresh').addEventListener('click', () => run(refresh));
byId('add').addEventListener('click', () => openEditor());
byId('cancel').addEventListener('click', closeEditor);

editor.addEventListener('submit', event => {
  event.preventDefault();
  run(async () => {
    const fields = new FormData(editor);
    const project = Object.fromEntries(fields);
    project.tags = fields.getAll('tags');
    for (const name of ['badges', 'skills']) project[name] = project[name].split('\n').map(line => line.trim()).filter(Boolean);
    project.signupOpen = fields.has('signupOpen');
    project.capacity = fields.get('capacity') === '' ? null : Number(fields.get('capacity'));
    project.confirmedSpots = Number(fields.get('confirmedSpots'));
    project.completionPercent = Number(fields.get('completionPercent'));
    if (project.capacity !== null && project.confirmedSpots > project.capacity) {
      throw new Error('Confirmed spots cannot exceed total spots.');
    }
    project.completed = editing?.completed ?? false;
    if (editing) Object.assign(project, {id: editing.id, revision: editing.revision});
    await api('projects', editing ? 'PUT' : 'POST', project);
    closeEditor();
    notice.textContent = 'Project saved.';
    await refresh();
  });
});
