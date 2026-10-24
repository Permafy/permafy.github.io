(() => {
    'use strict';

    const organization = 'Permafy';
    const api = 'https://api.github.com';
    const categorySelector = '[data-penguinmodsvelteui-category="true"]';
    const refreshInterval = 5 * 60 * 1000;
    const feedCacheKey = 'permafy:recent-commits:v1';
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

    async function requestJSON(url) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(url, {
                headers: { Accept: 'application/vnd.github+json' },
                cache: 'default',
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }
            return await response.json();
        } finally {
            clearTimeout(timeout);
        }
    }

    function readCache(key) {
        try {
            const cached = JSON.parse(localStorage.getItem(key) || 'null');
            return cached && Array.isArray(cached.items) ? cached : null;
        } catch (error) {
            return null;
        }
    }

    function writeCache(key, items, extra = {}) {
        try {
            localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items, ...extra }));
        } catch (error) {
            // Storage can be disabled or full; the live feed still works without it.
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

    async function loadPushEvent(event) {
        const fullName = event.repo.name;
        const repo = {
            name: fullName.split('/').pop(),
            full_name: fullName,
            html_url: `https://github.com/${fullName}`
        };
        const { before, head, ref } = event.payload;
        const compare = await requestJSON(
            `${api}/repos/${fullName}/compare/${before}...${head}`
        );
        const items = (compare.commits || []).map((commit) => ({
            repo,
            commit,
            actor: event.actor,
            branch: ref?.replace(/^refs\/heads\//, ''),
            pushedAt: event.created_at,
            state: 'unavailable'
        }));
        return { pushId: String(event.payload.push_id), items };
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function makeCard(item) {
        const card = makeElement('article', 'recent-commit-card');
        const avatarUrl = item.commit?.author?.avatar_url || item.actor?.avatar_url;
        const author = item.commit?.author?.login || item.actor?.login || item.commit?.commit.author.name || 'Unknown author';
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

    function render(category, items, emptyMessage = 'No recent commits found.') {
        const container = category.querySelector('[data-penguinmodsvelteui-category-container="true"]');
        if (!container) return;

        const list = makeElement('div', 'recent-commits-list');
        if (items.length) {
            items
                .sort((a, b) => new Date(b.commit?.commit.author.date || 0) - new Date(a.commit?.commit.author.date || 0))
                .forEach((item) => list.append(makeCard(item)));
        } else {
            list.append(makeElement('p', 'recent-commits-message', emptyMessage));
        }
        container.replaceChildren(list);
    }

    function refreshFeed(category) {
        if (feedPromise) return feedPromise;

        feedPromise = (async () => {
            const cached = readCache(feedCacheKey);
            const seenPushIds = new Set(cached?.seenPushIds || []);
            const events = await requestJSON(`${api}/orgs/${organization}/events?per_page=100`);
            if (!Array.isArray(events)) throw new Error('Unexpected events response');

            const recentPushes = events
                .filter((event) => event.type === 'PushEvent' && event.payload?.head && event.payload?.before && event.payload?.push_id)
                .slice(0, 10);
            const newPushes = recentPushes.filter((event) => !seenPushIds.has(String(event.payload.push_id)));
            const results = await mapLimit(newPushes, 4, loadPushEvent);
            const discovered = [];

            results.forEach((result) => {
                if (result.error) return;
                seenPushIds.add(result.pushId);
                discovered.push(...result.items);
            });

            const uniqueDiscovered = Array.from(new Map(discovered.map((item) => [item.commit.sha, item])).values())
                .sort((a, b) => new Date(b.commit.commit.author.date) - new Date(a.commit.commit.author.date));
            render(category, [...uniqueDiscovered, ...(cached?.items || [])]
                .filter((item, index, all) => all.findIndex((candidate) => candidate.commit.sha === item.commit.sha) === index)
                .sort((a, b) => new Date(b.commit.commit.author.date) - new Date(a.commit.commit.author.date))
                .slice(0, 30));

            const commitsToCheck = uniqueDiscovered.slice(0, 12);
            const checkedCommits = await mapLimit(commitsToCheck, 4, async (item) => ({
                ...item,
                state: await getStatus(item.repo, item.commit.sha).catch(() => 'unavailable')
            }));
            const checkedBySha = new Map(checkedCommits.map((item) => [item.commit.sha, item]));
            const items = [...uniqueDiscovered, ...(cached?.items || [])]
                .map((item) => checkedBySha.get(item.commit.sha) || item)
                .filter((item, index, all) => all.findIndex((candidate) => candidate.commit.sha === item.commit.sha) === index)
                .sort((a, b) => new Date(b.commit.commit.author.date) - new Date(a.commit.commit.author.date))
                .slice(0, 30);

            writeCache(feedCacheKey, items, { seenPushIds: Array.from(seenPushIds).slice(-100) });
            render(category, items);
        })().catch(() => {
            const cached = readCache(feedCacheKey);
            if (cached?.items?.length) {
                render(category, cached.items);
            } else {
                render(category, [], 'Could not load recent commits. Retrying shortly.');
            }
        }).finally(() => {
            feedPromise = null;
        });

        return feedPromise;
    }

    async function initialize(category) {
        const title = category.querySelector('[data-penguinmodsvelteui-category-headertext="true"]');
        const container = category.querySelector('[data-penguinmodsvelteui-category-container="true"]');
        if (!title || !container) return;
        const alreadyReady = category.dataset.recentCommitsReady === 'true';
        category.dataset.recentCommitsReady = 'true';
        category.classList.add('recent-commits-category');
        if (title.textContent !== 'Recent Commits') title.textContent = 'Recent Commits';

        const more = category.querySelector('[data-penguinmodsvelteui-category-headersecondary="true"] a');
        if (more) {
            const repositoriesUrl = `https://github.com/orgs/${organization}/repositories`;
            if (more.href !== repositoriesUrl) more.href = repositoriesUrl;
            if (more.textContent !== 'See all repositories') more.textContent = 'See all repositories';
            if (more.getAttribute('aria-label') !== 'See all Permafy repositories on GitHub') {
                more.setAttribute('aria-label', 'See all Permafy repositories on GitHub');
            }
        }

        const cachedFeed = readCache(feedCacheKey);
        if (!container.querySelector('.recent-commits-list')) {
            render(category, cachedFeed?.items || [], 'Loading recent commits…');
        }
        category.classList.remove('recent-commits-pending');
        if (alreadyReady) return;
        refreshFeed(category);
    }

    const observer = new MutationObserver(() => {
        const category = findCategory();
        if (category) initialize(category);
    });

    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
    const category = findCategory();
    if (category) initialize(category);
    setInterval(() => {
        const currentCategory = findCategory();
        if (currentCategory) refreshFeed(currentCategory);
    }, refreshInterval);
})();
