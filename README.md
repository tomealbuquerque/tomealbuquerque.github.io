# Tomé Albuquerque | Personal research portfolio

A lightweight, responsive GitHub Pages site built from the November 2026 CV and public GitHub profile. No framework, build tools, API keys, analytics or tracking dependencies.

## Publish
1. Create a GitHub repository named `tomealbuquerque.github.io` under your personal account. If it already exists, back it up and merge these files rather than overwriting blindly.
2. Upload the CONTENTS of this ZIP to the repository root, not the enclosing folder. Include `index.html`, `styles.css`, `script.js`, `publications.json` and `.nojekyll`.
3. Open repository Settings > Pages. Under Build and deployment, choose Deploy from a branch, select `main` and `/ (root)`, then Save.
4. Open the site URL shown by GitHub Pages after deployment completes.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview
Open index.html in a browser. All core content, filtering and theme controls work locally without a server. The HTML preview download is self-contained.

## Included integrations
- Google Scholar: direct profile links and a full-publication-record call to action using the ID from the CV.
- GitHub: profile and six verified public repository links.
- LinkedIn: direct profile and contact links.
- Publisher DOI / arXiv links for publications where supplied in the CV.
- University-hosted doctoral thesis.
- Schema.org Person metadata for search engines.

These are profile/content links, NOT automatic synchronization. No citation metrics have been invented. Scholar profile content could not be retrieved during creation. Publications are a curated CV snapshot. There is no Scholar scraping, third-party proxy or API dependency.

## Edit content
- Bio, experience, education, software and publication markup: index.html.
- Colors and responsive layout: styles.css.
- Search/filter and theme toggle: script.js.
- Publication metadata: publications.json. IMPORTANT: this JSON is a downloadable metadata snapshot, not the rendering source. Update BOTH JSON and publication HTML when adding papers.
- Optional portrait: replace the TA monogram with your own approved local image and descriptive alt text.
- Optional CV download: add a public-safe CV PDF and a link in the hero. The original CV is deliberately NOT bundled because it includes a phone number, permit details and employer-specific information.
- ORCID, Hugging Face, Semantic Scholar and other profiles: add only your verified profile URLs; none were invented.

## Content checks before publication
- Confirm employer-approved wording and publication status, especially 2026 entries. Entries follow the CV and were not independently verified against every publisher.
- The CV lists BiGMINT at CVPR 2026 but provides no paper URL. Its entry deliberately has no fabricated paper link.
- DeepCellMorpho and Quasi-Unimodal Loss are linked as standalone public software, not asserted to be the official repositories of a specific paper.
- No unpublished MorphoBench / CP-JEPA work, internal platform names, private phone number, permit details or internal links are included.
- Present employment reflects the November 2026 CV; update it after any role change.
- Check links and review the mobile layout before launch.

## Accessibility and privacy
Semantic headings, skip link, keyboard focus, labelled search/filter controls, live search result count, reduced-motion support, responsive layout and print styles. Theme preference is saved only in the visitor's local browser; no tracking or network API calls are made by the scripts. External sites are contacted only when links are followed.

## Provenance
Source: professional_cv_tome_albuquerque_full (10).pdf, modified 17 November 2026, and https://github.com/tomealbuquerque. Website wording is condensed for a public research portfolio, not a verbatim CV reproduction. No public deployment was performed from this environment.
