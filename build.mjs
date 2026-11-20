import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('dist/data', {recursive: true});
for (const path of ['index.html', 'styles.css', 'faculty.html', 'faculty.mjs', 'data/pathways.mjs', 'data/availability.mjs']) {
  await copyFile(path, 'dist/' + path);
}
