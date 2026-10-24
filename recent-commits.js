(() => {
    'use strict';

    const organization = 'Permafy';
    const api = 'https://api.github.com';
    const categorySelector = '[data-penguinmodsvelteui-category="true"]';
    const cacheDuration = 5 * 60 * 1000;
    const feedCacheKey = 'permafy:recent-commits:v1';
    const repositoryCacheKey = 'permafy:recent-commit-repositories:v1';
    const fallbackRepositoryNames = [
        'projects', 'compiler', 'extensions', 'docs', 'decompiler', 'scratch-flash',
        'blockder', 'permafy-0-2', 'bin2fix', 'backend-api', 'Lithium-scratchMod',
        'scratch-flashz',
        'studio', 'permafy.github.io'
    ];
    let feedPromise;
    const stateLabels = {
        deploying: 'Deploying',
        progress: 'In progress',
        failed: 'Failed',
        passed: 'Passed',
        cancelled: 'Cancelled',
        none: 'No checks',
        unavailable: 'Status unavailable'
    };

    function findCategory() {
        return Array.from(document.querySelectorAll(categorySelector)).find((category) => {
            const heading = category.querySelector('[data-penguinmodsvelteui-category-headertext="true"]');
            return heading && ['PenguinNews', 'Recent Commits'].includes(heading.textContent.trim());
        });
    }

    function requestJSON(url) {
        return fetch(url, {
            headers: { Accept: 'application/vnd.github+json' },
            cache: 'default'
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }
            return response.json();
        });
    }

    function readCache(key) {
        try {
            const cached = JSON.parse(localStorage.getItem(key) || 'null');
            return cached && Array.isArray(cached.items) ? cached : null;
        } catch (error) {
            return null;
        }
    }

    function writeCache(key, items) {
        try {
            localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items }));
        } catch (error) {
            // Storage can be disabled or full; the live feed still works without it.
        }
    }

    function fallbackRepositories() {
        return fallbackRepositoryNames.map((name) => ({
            name,
            full_name: `${organization}/${name}`,
            html_url: `https://github.com/${organization}/${encodeURIComponent(name)}`
        }));
    }

    async function getRepositories() {
        try {
            const repositories = await requestJSON(`${api}/orgs/${organization}/repos?per_page=100&type=public`);
            if (!Array.isArray(repositories)) throw new Error('Unexpected repositories response');
            writeCache(repositoryCacheKey, repositories);
            return repositories;
        } catch (error) {
            const cached = readCache(repositoryCacheKey);
            return cached?.items?.length ? cached.items : fallbackRepositories();
        }
    }

    async function mapLimit(items, limit, callback) {
        let next = 0;
        const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
            while (next < items.length) {
                const index = next++;
                try {
                    items[index] = await callback(items[index]);
                } catch (error) {
                    items[index] = { repo: items[index], error };
                }
            }
        });
        await Promise.all(workers);
        return items;
    }

    function getCommitState(checks, statuses) {
        const failed = checks.some((check) => ['failure', 'timed_out', 'action_required', 'startup_failure', 'stale'].includes(check.conclusion)) ||
            statuses.some((status) => ['failure', 'error'].includes(status.state));
        if (failed) return 'failed';

        const activeDeployment = checks.some((check) => check.status !== 'completed' && /deploy/i.test(check.name)) ||
            statuses.some((status) => status.state === 'pending' && /deploy/i.test(status.context));
        if (activeDeployment) return 'deploying';

        if (checks.some((check) => check.status !== 'completed') || statuses.some((status) => status.state === 'pending')) {
            return 'progress';
        }

        if (checks.some((check) => check.conclusion === 'cancelled') || statuses.some((status) => status.state === 'error')) {
            return 'cancelled';
        }

        if (checks.some((check) => ['success', 'neutral', 'skipped'].includes(check.conclusion)) ||
            (statuses.length > 0 && statuses.every((status) => status.state === 'success'))) {
            return 'passed';
        }
        return 'none';
    }

    async function getStatus(repo, sha) {
        const checksUrl = `${api}/repos/${repo.full_name}/commits/${sha}/check-runs`;
        const checkData = await requestJSON(checksUrl);
        let checks = checkData.check_runs || [];
        let statuses = [];

        if (checks.length === 0) {
            const statusData = await requestJSON(`${api}/repos/${repo.full_name}/commits/${sha}/status`);
            statuses = statusData.statuses || [];
        }
        return getCommitState(checks, statuses);
    }

    async function loadRepository(repo) {
        const commits = await requestJSON(`${api}/repos/${repo.full_name}/commits?per_page=1`);
        const commit = commits[0];
        if (!commit) return { repo, empty: true };

        let state;
        try {
            state = await getStatus(repo, commit.sha);
        } catch (error) {
            state = 'unavailable';
        }
        return { repo, commit, state };
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function makeCard(item) {
        const card = makeElement('article', 'recent-commit-card');
        const avatarUrl = item.commit && item.commit.author && item.commit.author.avatar_url;
        const author = item.commit && (item.commit.author?.login || item.commit.commit.author.name) || 'Unknown author';
        const subject = item.commit && item.commit.commit.message.split('\n')[0] || 'Could not load latest commit';
        const head = makeElement('div', 'recent-commit-head');
        const identity = makeElement('div', 'recent-commit-identity');
        const state = item.state || 'unavailable';
        const badge = makeElement('span', `recent-commit-state is-${state}`, stateLabels[state]);

        if (item.commit) {
            const avatar = makeElement('img', 'recent-commit-avatar');
            avatar.src = avatarUrl || `https://github.com/${encodeURIComponent(author)}.png`;
            avatar.alt = `${author} avatar`;
            avatar.loading = 'lazy';
            avatar.referrerPolicy = 'no-referrer';
            head.append(avatar);
        } else {
            head.append(makeElement('span', 'recent-commit-avatar recent-commit-avatar-placeholder', 'GH'));
        }

        identity.append(makeElement('a', 'recent-commit-repo', item.repo.name));
        identity.lastChild.href = item.repo.html_url;
        identity.lastChild.target = '_blank';
        identity.lastChild.rel = 'noopener noreferrer';
        identity.append(makeElement('span', 'recent-commit-author', author));
        head.append(identity, badge);
        card.append(head);

        if (item.commit) {
            const message = makeElement('a', 'recent-commit-message', subject);
            message.href = item.commit.html_url;
            message.target = '_blank';
            message.rel = 'noopener noreferrer';
            message.title = subject;
            card.append(message);

            const sha = makeElement('a', 'recent-commit-sha', item.commit.sha.slice(0, 7));
            sha.href = item.commit.html_url;
            sha.target = '_blank';
            sha.rel = 'noopener noreferrer';
            sha.setAttribute('aria-label', `Commit ${item.commit.sha}`);
            card.append(sha);
        } else {
            card.append(makeElement('p', 'recent-commit-message', item.empty ? 'No commits yet' : 'Latest commit could not be loaded'));
        }
        return card;
    }

    function render(category, items) {
        const container = category.querySelector('[data-penguinmodsvelteui-category-container="true"]');
        if (!container) return;

        const list = makeElement('div', 'recent-commits-list');
        items
            .sort((a, b) => new Date(b.commit?.commit.author.date || 0) - new Date(a.commit?.commit.author.date || 0))
            .forEach((item) => list.append(makeCard(item)));
        container.replaceChildren(list);
    }

    async function initialize(category) {
        const title = category.querySelector('[data-penguinmodsvelteui-category-headertext="true"]');
        const container = category.querySelector('[data-penguinmodsvelteui-category-container="true"]');
        if (!title || !container) return;
        const alreadyReady = category.dataset.recentCommitsReady === 'true';
        category.dataset.recentCommitsReady = 'true';
        category.classList.add('recent-commits-category');
        title.textContent = 'Recent Commits';

        const more = category.querySelector('[data-penguinmodsvelteui-category-headersecondary="true"] a');
        if (more) {
            more.href = `https://github.com/orgs/${organization}/repositories`;
            more.textContent = 'See all repositories';
            more.setAttribute('aria-label', 'See all Permafy repositories on GitHub');
        }

        const cachedFeed = readCache(feedCacheKey);
        if (!container.querySelector('.recent-commits-list')) {
            if (cachedFeed?.items?.length) {
                render(category, cachedFeed.items);
            } else {
                render(category, []);
                container.querySelector('.recent-commits-list').append(
                    makeElement('p', 'recent-commits-message', 'Loading recent commits…')
                );
            }
        }
        category.classList.remove('recent-commits-pending');
        if (alreadyReady) return;

        if (!cachedFeed || Date.now() - cachedFeed.savedAt >= cacheDuration) {
            feedPromise = (async () => {
                const repositories = await getRepositories();
                return mapLimit(repositories, 4, loadRepository);
            })();
        }

        if (feedPromise) {
            try {
                const items = await feedPromise;
                render(category, items);
                writeCache(feedCacheKey, items);
            } catch (error) {
                if (!cachedFeed?.items?.length) {
                    render(category, fallbackRepositories().map((repo) => ({ repo, error })));
                }
            }
        }
    }

    const observer = new MutationObserver(() => {
        const category = findCategory();
        if (category) initialize(category);
    });

    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
    const category = findCategory();
    if (category) initialize(category);
})();
