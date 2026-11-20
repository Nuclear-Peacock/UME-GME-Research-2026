import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { SEED_PROJECTS } from '../../data/projects.mjs';
import { PATHWAYS } from '../../data/pathways.mjs';

const textFields = { title: 200, hook: 500, status: 200, why: 3000, role: 3000, output: 1500, timeline: 500 };
const requiredFields = ['title', 'hook', 'status', 'why', 'role', 'output'];
const pathways = new Set(PATHWAYS.map(pathway => pathway.key));
const seeds = SEED_PROJECTS.map(project => ({...project, id: String(project.id), completed: false}));

function json(data, status = 200) {
  return Response.json(data, {status, headers: {'Cache-Control': 'no-store'}});
}

function hash(text) {
  return createHash('sha256').update(text).digest();
}

function authorized(request, token) {
  return timingSafeEqual(hash(request.headers.get('authorization') ?? ''), hash('Bearer ' + token));
}

async function body(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null;
  if (!request.body) return null;
  const stream = request.body.getReader();
  let size = 0;
  let raw = '';
  const decoder = new TextDecoder();
  for (;;) {
    const { value, done } = await stream.read();
    if (done) break;
    size += value.byteLength;
    if (size > 48_000) {
      await stream.cancel();
      return null;
    }
    raw += decoder.decode(value, {stream: true});
  }
  try {
    const value = JSON.parse(raw + decoder.decode());
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

async function records(store, prefix) {
  const result = [];
  for await (const page of store.list({prefix, paginate: true})) {
    const read = await Promise.all(page.blobs.map(async ({key, etag}) => {
      const blob = await store.getWithMetadata(key, {type: 'json'});
      return blob && {...blob.data, revision: blob.etag ?? etag};
    }));
    result.push(...read.filter(Boolean));
  }
  return result;
}

async function listProjects(store) {
  const projects = new Map(seeds.map(project => [project.id, {...project, revision: null}]));
  for (const project of await records(store, 'project/')) projects.set(project.id, project);
  return [...projects.values()].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
}

function normalizeProject(input, current) {
  if (typeof input.completed !== 'boolean' || !pathways.has(input.accentKey)) return null;
  const project = {};
  for (const [field, limit] of Object.entries(textFields)) {
    if (typeof input[field] !== 'string' || input[field].length > limit) return null;
    project[field] = input[field].trim();
  }
  if (requiredFields.some(field => !project[field])) return null;
  if (!Array.isArray(input.tags) || input.tags.length > pathways.size || input.tags.some(tag => !pathways.has(tag))) return null;
  for (const field of ['badges', 'skills']) {
    if (!Array.isArray(input[field]) || input[field].length > 15 ||
      input[field].some(item => typeof item !== 'string' || !item.trim() || item.length > 120)) return null;
    project[field] = input[field].map(item => item.trim());
  }
  return {
    ...project,
    completed: input.completed,
    accentKey: input.accentKey,
    tags: [...new Set([input.accentKey, ...input.tags])],
    icon: current?.icon ?? 'casefile',
    urgent: current?.urgent ?? false,
    ongoing: current?.ongoing ?? false,
    id: current?.id ?? randomUUID(),
    createdAt: current ? current.createdAt ?? '' : new Date().toISOString()
  };
}

async function saveProject(request, store) {
  const input = await body(request);
  if (!input) return json({error: 'Invalid project.'}, 400);
  const editing = request.method === 'PUT';
  let current;
  if (editing) {
    if (typeof input.id !== 'string' || !/^[a-z0-9-]{1,36}$/.test(input.id)) {
      return json({error: 'Invalid project ID.'}, 400);
    }
    current = (await listProjects(store)).find(project => project.id === input.id);
    if (!current) return json({error: 'Project not found.'}, 404);
    if (input.revision !== current.revision) return json({error: 'Project changed. Reload it and try again.'}, 409);
  }
  const project = editing && Object.keys(input).every(key => ['id', 'revision', 'completed'].includes(key))
    && typeof input.completed === 'boolean'
    ? {...current, completed: input.completed}
    : normalizeProject(input, current);
  if (!project) return json({error: 'Check the project fields and try again.'}, 400);
  delete project.revision;
  const result = await store.setJSON('project/' + project.id, project, current?.revision
    ? {onlyIfMatch: current.revision}
    : {onlyIfNew: true});
  if (!result.modified) return json({error: 'Project changed. Reload it and try again.'}, 409);
  return json({ok: true}, editing ? 200 : 201);
}

async function submitInterest(request, store) {
  const input = await body(request);
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const email = typeof input?.email === 'string' ? input.email.trim() : '';
  const ids = input?.projectIds;
  if (!name || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Array.isArray(ids) || !ids.length || ids.length > 100 || ids.some(id => typeof id !== 'string' || id.length > 36)) {
    return json({error: 'Provide a name, email, and at least one project.'}, 400);
  }
  const uniqueIds = [...new Set(ids)].sort();
  const key = 'interest/' + hash(JSON.stringify([email.toLowerCase(), uniqueIds])).toString('hex');
  if (await store.getMetadata(key)) return json({ok: true});
  const projects = new Map((await listProjects(store)).filter(project => !project.completed)
    .map(project => [project.id, project.title]));
  if (uniqueIds.some(id => !projects.has(id))) return json({error: 'A selected project has closed.'}, 409);
  await store.setJSON(key, {
    name, email,
    projects: uniqueIds.map(id => ({id, title: projects.get(id)})),
    submittedAt: new Date().toISOString()
  }, {onlyIfNew: true});
  return json({ok: true}, 201);
}

export default async function handler(request) {
  const path = new URL(request.url).pathname;
  const method = request.method;
  try {
    const token = process.env.FACULTY_ACCESS_TOKEN;
    if (path !== '/api/projects' && (!token || token.length < 32)) {
      return json({error: 'Research portal setup is incomplete.'}, 503);
    }
    if (path.startsWith('/api/faculty/') && !authorized(request, token)) return json({error: 'Faculty sign-in required.'}, 401);
    const store = getStore({name: 'research-portal', consistency: 'strong'});
    if (path === '/api/projects' && method === 'GET') {
      const projects = await listProjects(store);
      return json(projects.filter(project => !project.completed)
        .map(({completed, revision, createdAt, ...project}) => project));
    }
    if (path === '/api/interests' && method === 'POST') return await submitInterest(request, store);
    if (path === '/api/faculty/projects') {
      if (method === 'GET') return json(await listProjects(store));
      if (method === 'POST' || method === 'PUT') return await saveProject(request, store);
    }
    if (path === '/api/faculty/interests' && method === 'GET') {
      const submissions = await records(store, 'interest/');
      return json(submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
        .map(({revision, ...submission}) => submission));
    }
    return json({error: 'Route not found.'}, 404);
  } catch (error) {
    console.error('Research portal request failed', error.name);
    return json({error: 'The research portal is temporarily unavailable.'}, 503);
  }
}

export const config = {
  path: ['/api/projects', '/api/interests', '/api/faculty/projects', '/api/faculty/interests']
};
