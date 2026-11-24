(() => {
	'use strict';

	const $ = (s) => document.querySelector(s);
	let data = JSON.parse($('#initial-data').textContent);
	let mode = 'selected';

	const curated = data.articles;
	const norm = (s) =>
		String(s || '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]/g, '');
	const chosen = new Set(curated.filter((p) => p.selected).map((p) => norm(p.title)));

	const esc = (s) =>
		String(s ?? '').replace(/[&<>"']/g, (c) =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			})[c],
		);

	const safe = (u) => {
		try {
			const x = new URL(u);
			return x.protocol === 'https:' ? x.href : '';
		} catch {
			return '';
		}
	};

	const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString('en-US') : '—');

	const boldAuthorName = (s) =>
		esc(s).replace(
			/(Tom[ée]\s+Albuquerque|T\.?\s*Albuquerque)/gi,
			'<strong class="author-emphasis">$1</strong>',
		);

	function renderPublications() {
		const q = $('#search').value.toLowerCase().trim();
		let rows = data.articles.filter(
			(p) =>
				(mode === 'all' || p.selected || chosen.has(norm(p.title))) &&
				[p.title, p.authors, p.venue, p.year].join(' ').toLowerCase().includes(q),
		);

		const sort = $('#sort').value;
		rows.sort((a, b) =>
			sort === 'title'
				? String(a.title).localeCompare(String(b.title))
				: sort === 'citations'
					? (b.citations ?? -1) - (a.citations ?? -1)
					: (Number(b.year) || 0) - (Number(a.year) || 0),
		);

		$('#papers').innerHTML = rows.length
			? rows
					.map((p) => {
						const u = safe(p.url);
						return `<article class="paper"><div class="paper-year">${esc(p.year || '—')}</div><div><h3>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a>` : esc(p.title)}</h3><p>${boldAuthorName(p.authors)}</p><p class="venue">${esc(p.venue)}</p>${u ? `<a class="paper-link" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${data.source === 'Google Scholar' ? 'View on Scholar' : 'Read publication'} ↗</a>` : ''}</div>${Number.isFinite(p.citations) ? `<div class="paper-citations"><strong>${fmt(p.citations)}</strong>citations</div>` : ''}</article>`;
					})
					.join('')
			: '<p class="status">No matching publications. Try All publications or a different search.</p>';

		$('#result-status').textContent = `${rows.length} publication${rows.length === 1 ? '' : 's'} shown · ${data.source === 'Google Scholar' ? 'Google Scholar record' : 'Selected publications'}`;
		$('#selected').setAttribute('aria-pressed', String(mode === 'selected'));
		$('#all').setAttribute('aria-pressed', String(mode === 'all'));
	}

	function metrics() {
		const m = data.metrics || {};
		const citationsEl = $('#citations');
		const hindexEl = $('#hindex');
		const i10indexEl = $('#i10index');
		const syncStatusEl = $('#sync-status');

		if (citationsEl) citationsEl.textContent = fmt(m.citations);
		if (hindexEl) hindexEl.textContent = fmt(m.h_index);
		if (i10indexEl) i10indexEl.textContent = fmt(m.i10_index);

		if (data.updated_at && syncStatusEl) {
			const d = new Date(data.updated_at);
			const age = (Date.now() - d.getTime()) / 86400000;
			syncStatusEl.textContent = Number.isFinite(d.getTime())
				? `${age > 3 ? 'Cached Scholar data' : 'Synced from Scholar'} · ${d.toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})}${age > 3 ? ' · update overdue' : ''}`
				: 'Scholar update date unavailable';
		}
	}

	function renderRepos(repos, statusMessage) {
		const target = $('#repos');
		if (!target) return;

		target.innerHTML = repos
			.map((p) => {
				const stats = [];
				if (Number.isFinite(p.stars)) stats.push(`★ ${p.stars}`);
				if (Number.isFinite(p.forks)) stats.push(`⑂ ${p.forks}`);
				const metaTail = stats.length ? ` · ${stats.join(' · ')}` : '';

				return `<a class="project" href="${esc(safe(p.url))}" target="_blank" rel="noopener noreferrer"><div class="repo-top"><span>PUBLIC REPOSITORY</span><span aria-hidden="true">↗</span></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="repo-bottom">${esc(p.language || 'Repository')}${metaTail}</div></a>`;
			})
			.join('');

		const statusEl = $('#repo-status');
		if (statusEl && statusMessage) statusEl.textContent = statusMessage;
	}

	async function get(url) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 12000);
		try {
			const r = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
			if (!r.ok) throw Error('Unavailable');
			return await r.json();
		} finally {
			clearTimeout(timer);
		}
	}

	$('#selected').addEventListener('click', () => {
		mode = 'selected';
		renderPublications();
	});
	$('#all').addEventListener('click', () => {
		mode = 'all';
		renderPublications();
	});
	$('#search').addEventListener('input', renderPublications);
	$('#sort').addEventListener('change', renderPublications);

	let dark = matchMedia('(prefers-color-scheme: dark)').matches;
	try {
		const t = localStorage.getItem('ta-theme');
		if (t) dark = t === 'dark';
	} catch {}

	function theme() {
		document.body.classList.toggle('dark', dark);
		$('#theme').setAttribute('aria-pressed', String(dark));
		$('#theme').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
	}

	theme();
	$('#theme').addEventListener('click', () => {
		dark = !dark;
		theme();
		try {
			localStorage.setItem('ta-theme', dark ? 'dark' : 'light');
		} catch {}
	});

	$('#year').textContent = new Date().getFullYear();
	renderPublications();
	metrics();

	const selectedRepos = JSON.parse($('#repo-data').textContent);
	renderRepos(selectedRepos, 'Selected repositories · loading live GitHub stars and forks...');

	if (location.protocol !== 'file:') {
		get('data/scholar.json')
			.then((d) => {
				if (!Array.isArray(d.articles) || !d.articles.length) throw Error('Invalid data');
				data = d;
				metrics();
				renderPublications();
			})
			.catch(() => {});

		Promise.allSettled(
			selectedRepos.map(async (r) => {
				const path = new URL(r.url).pathname;
				const x = await get('https://api.github.com/repos' + path);
				return {
					...r,
					description: r.description,
					language: x.language || r.language,
					stars: x.stargazers_count,
					forks: x.forks_count,
					url: x.html_url,
				};
			}),
		)
			.then((results) => {
				let live = 0;
				const enriched = results.map((r, i) => {
					if (r.status === 'fulfilled') {
						live++;
						return r.value;
					}
					return selectedRepos[i];
				});

				renderRepos(
					enriched,
					live
						? `GitHub metadata refreshed for ${live} of ${results.length} repositories.`
						: 'Selected repositories · GitHub metadata temporarily unavailable.',
				);
			})
			.catch(() => {
				renderRepos(selectedRepos, 'Selected repositories · GitHub metadata temporarily unavailable.');
			});
	} else {
		renderRepos(selectedRepos, 'Selected repositories · open via localhost to load live GitHub stars and forks.');
	}
})();
