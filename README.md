# Tomé Albuquerque | Research portfolio v2

## What changed
Editorial ivory/forest-green design, supplied portrait, responsive layouts, accessible controls, searchable publications, most-cited sorting, light/dark mode, structured metadata and automatic Scholar synchronization. No analytics, external fonts or frameworks.

## IMPORTANT: this package uses GitHub Actions, NOT branch publishing
The website is in public/. The workflow is in .github/workflows/. Upload the ENTIRE package contents to the repository root, preserving those directories. Do not upload only public/, or automatic synchronization will not run. Do not upload the ZIP itself.

## One-time activation
1. Replace the old site with the package contents, including hidden .github directory. Keep .git intact. Commit and push to main.
2. Repository Settings > Pages > Build and deployment > Source: GitHub Actions. This supersedes the earlier 'Deploy from a branch' instructions.
3. Create a SerpApi account and obtain an API key: https://serpapi.com/google-scholar-author-api . SerpApi is a third-party provider, not an official Google Scholar API. Review its terms, privacy and current pricing. No subscription has been purchased or account created for you.
4. Repository Settings > Secrets and variables > Actions > New repository secret. Name: SERPAPI_KEY. Value: your key. NEVER put the key in JavaScript, public/ or a commit. Do not send it in chat.
5. Actions > Refresh Scholar and deploy website > Run workflow. The first successful run activates synchronized Scholar data. Check the run log and the visible 'Synced from Scholar' date.
6. The workflow requests a daily refresh at 06:23 UTC. It also runs on pushes to main and manually. Schedules can be delayed or disabled by GitHub, so the page shows a dated snapshot, not a real-time feed.
7. Your screenshot showed a PRIVATE repository. If your plan does not support Pages from private repositories, make this personal-site repository public only after reviewing its full history for private material. Deleting files in a new commit does not erase them from history.

## What is actually live
- Google Scholar: build-time refresh of the publication list, per-paper citation counts, total citations, h-index and i10-index through SerpApi. Profile ID RfeLaPEAAAAJ. Paginated, with validation and no invented metrics. Selected work is matched against curated titles; All publications shows the full synchronized record. Scholar may include preprints and duplicates; no acceptance status is inferred.
- GitHub: browser-side public API requests update language and star counts for four curated public repositories. Rate limits or offline conditions leave the curated fallback visible.
- LinkedIn: profile link only. No scraping or automatic LinkedIn synchronization.
- ORCID/Hugging Face: not added because no verified profile URL was provided.

## Failure handling
Before fetching Scholar, the script attempts to recover the last successfully deployed Scholar JSON from the Pages URL. If the API key is absent, a request fails, metrics are incomplete or pagination is inconsistent, the previous successful data and original timestamp are retained when recoverable. Otherwise the CV snapshot is shown. No fabricated metrics. The UI marks data older than three days as overdue. The API key stays in the Actions environment and is never written into public artifacts or logs. GitHub/SerpApi uptime and quotas are external dependencies.

## Local preview
Open preview.html (separate download) for a self-contained preview with the portrait and CV publication snapshot. To test the packaged website with local fetch, run `python -m http.server 8000 --directory public` from the repository root and open the localhost address printed by Python. Scholar refresh requires a configured key and network access; it was NOT run against a live account during creation.

## Edit
- public/index.html: bio, research, career, education and selected-paper snapshot in initial-data.
- public/styles.css: layout and themes.
- public/script.js: UI and GitHub integration.
- public/data/scholar.json: initial fallback; automatically replaced in the deployment artifact, not committed back to Git.
- public/assets/portrait.webp: supplied portrait, converted to WebP without generative alteration.
- scripts/sync_scholar.py: provider and pagination logic.
- .github/workflows/site.yml: schedule and Pages deployment.

## Review before publishing
The content is condensed from the CV used in the previous version. Employer dates reflect November 2026 and need updating after a role change. Verify all publication statuses and DOI links before launch. The original CV, private phone number, permit details, internal documents and unpublished project names are not bundled. No claim is made that the repository has been modified or the site deployed. Photo is used as supplied; no identity recognition was performed.

## References
https://serpapi.com/google-scholar-author-api
https://serpapi.com/google-scholar-author-cited-by
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
https://docs.github.com/actions/writing-workflows/workflow-syntax-for-github-actions
