# UME/GME Research Opportunities

Learners use the homepage to select open projects and submit their name and email. Faculty use `/faculty.html` to add or edit projects, mark projects complete, reopen projects, and review submissions with the selected project titles.

## Deploy to Netlify

1. In the existing Netlify site, add a secret environment variable named `FACULTY_ACCESS_TOKEN` for the Functions runtime in the Production deploy context. Generate a random value with `openssl rand -hex 32` and share it privately with authorized faculty. Faculty use the same token, so rotate it if access needs to be revoked.
2. Merge into the branch that Netlify deploys. The checked-in `netlify.toml` builds the pages and deploys the API. The existing project catalog is used automatically. Project edits and student submissions persist in the site's Netlify Blobs store.
3. Open `/faculty.html` on the deployed site and sign in. Add a project, confirm it appears in the learner view, and mark it complete to hide it. An open learner page checks for changes every 10 seconds. Completed projects retain their submission history.
4. Use **Refresh dashboard** to load new student submissions. The dashboard shows each student's name, email, selected projects, and submission time.

## Develop locally

Use Node.js 22, run `npm ci`, and set a separate local access token in a gitignored `.env` file. Run `npx netlify-cli dev` for the pages, API, and local Blobs store. Use fictional names and emails when testing. `npm run build` produces the static files in `dist/`.

## License

[MIT](LICENSE)
