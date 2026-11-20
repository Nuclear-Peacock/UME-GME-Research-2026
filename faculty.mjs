import { PATHWAYS } from './data/pathways.mjs';
import { PROJECT_TRACKING_DEFAULTS, projectAvailability, signupLabel, spotsLabel } from './data/availability.mjs';

const byId = id => document.getElementById(id);
const login = byId('login');
const editor = byId('editor');
const notice = byId('notice');
const dashboard = byId('dashboard');
const newProject = byId('newProject');
const add = byId('add');
const editorNotice = byId('editorNotice');
let token = '';
let editing = null;
let busy = false;
let editorTrigger = null;
let initialDraft = '';

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
  if (!projects.length) {
    byId('projects').replaceChildren(element('p', 'No projects yet.'));
    return;
  }
  byId('projects').replaceChildren(...projects.map(project => {
    project = {...PROJECT_TRACKING_DEFAULTS, ...project};
    const card = element('article', '');
    card.className = 'faculty-project';
    const toggle = element('button', '');
    toggle.type = 'button';
    toggle.id = 'edit-project-' + project.id;
    toggle.className = 'card faculty-project-button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Edit ' + project.title);
    toggle.addEventListener('click', () => openEditor(project, toggle, card));

    const {signupStatus, remainingSpots} = projectAvailability(project);
    const pathway = PATHWAYS.find(pathway => pathway.key === project.accentKey);
    if (pathway) toggle.style.setProperty('--card-accent', 'var(' + pathway.accent + ')');

    const status = element('span', signupLabel(signupStatus));
    status.id = 'signup-' + project.id;
    status.className = 'badge faculty-signup';
    status.dataset.status = signupStatus;

    const title = element('span', project.title);
    title.className = 'faculty-project-title';
    const hook = element('span', project.hook);
    hook.className = 'hook';
    const stage = element('span', project.status);
    stage.className = 'faculty-stage';

    const metrics = element('span', '');
    metrics.id = 'metrics-' + project.id;
    metrics.className = 'faculty-metrics';
    const confirmed = project.capacity === null ? project.confirmedSpots : project.confirmedSpots + ' / ' + project.capacity;
    const interested = interestedByProject.get(project.id)?.size ?? 0;
    metrics.append(element('span', spotsLabel(remainingSpots)), element('span', confirmed + ' confirmed'),
      element('span', interested + ' interested'));

    const completion = project.completed ? 100 : project.completionPercent;
    const progress = document.createElement('progress');
    progress.max = 100;
    progress.value = completion;
    progress.setAttribute('aria-label', 'Project completion');
    const progressSummary = element('span', '');
    progressSummary.className = 'faculty-progress';
    const completionLabel = element('span', completion + '% complete');
    completionLabel.id = 'progress-' + project.id;
    progressSummary.append(completionLabel, progress);
    toggle.setAttribute('aria-describedby', [status.id, metrics.id, completionLabel.id].join(' '));

    const action = element('span', 'Edit project →');
    action.className = 'faculty-edit-label';
    toggle.append(status, title, hook, stage, metrics, progressSummary, action);
    card.append(toggle);
    return card;
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

async function run(action, errorTarget = notice) {
  if (busy) return;
  busy = true;
  notice.textContent = '';
  errorTarget.textContent = '';
  try {
    await action();
  } catch (error) {
    (errorTarget === editorNotice && editor.hidden ? notice : errorTarget).textContent = error.message;
  } finally {
    busy = false;
  }
}

function signOut() {
  token = '';
  dashboard.hidden = true;
  login.hidden = false;
  closeEditor();
  byId('projects').replaceChildren();
  byId('interests').replaceChildren();
}

function draft() {
  return JSON.stringify([...new FormData(editor)]);
}

function confirmSwitch() {
  return editor.hidden || draft() === initialDraft || window.confirm('Discard unsaved project changes?');
}

function closeEditor(returnFocus = false) {
  const trigger = editorTrigger;
  trigger?.setAttribute('aria-expanded', 'false');
  if (trigger !== add) trigger?.removeAttribute('aria-controls');
  trigger?.closest('.faculty-project')?.classList.remove('is-editing');
  editorTrigger = null;
  editing = null;
  editor.reset();
  editor.hidden = true;
  editorNotice.textContent = '';
  newProject.append(editor);
  if (returnFocus) trigger?.focus();
}

function openEditor(project, trigger, host) {
  if (busy || !confirmSwitch()) return;
  if (trigger === editorTrigger) {
    closeEditor(true);
    return;
  }
  closeEditor();
  editing = project;
  editorTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  trigger.setAttribute('aria-controls', editor.id);
  if (project) host.classList.add('is-editing');
  host.append(editor);
  byId('editorHeading').textContent = project ? 'Edit project' : 'New project';
  if (project) {
    for (const name of ['title', 'hook', 'status', 'why', 'role', 'output', 'timeline', 'accentKey', 'capacity', 'confirmedSpots', 'completionPercent']) {
      editor.elements[name].value = project[name] ?? '';
    }
    editor.elements.signupOpen.checked = project.signupOpen;
    editor.elements.completed.checked = project.completed;
    for (const name of ['skills', 'badges']) editor.elements[name].value = project[name].join('\n');
    for (const checkbox of editor.querySelectorAll('[name=tags]')) checkbox.checked = project.tags.includes(checkbox.value);
  }
  initialDraft = draft();
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
    byId('projectsHeading').focus();
  });
});
byId('logout').addEventListener('click', () => {
  if (busy || !confirmSwitch()) return;
  signOut();
  login.elements.token.focus();
  notice.textContent = 'Signed out.';
});
byId('refresh').addEventListener('click', () => {
  if (busy || !confirmSwitch()) return;
  closeEditor();
  run(async () => {
    await refresh();
    notice.textContent = 'Dashboard refreshed.';
  });
});
add.addEventListener('click', () => openEditor(null, add, newProject));
byId('cancel').addEventListener('click', () => {
  if (!busy) closeEditor(true);
});

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
    project.completed = fields.has('completed');
    if (editing) Object.assign(project, {id: editing.id, revision: editing.revision});
    editorNotice.textContent = 'Saving project…';
    await api('projects', editing ? 'PUT' : 'POST', project);
    const returnTo = editorTrigger.id;
    closeEditor(true);
    notice.textContent = 'Project saved.';
    await refresh();
    byId(returnTo)?.focus();
  }, editorNotice);
});
