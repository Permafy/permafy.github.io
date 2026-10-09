import adapter from '@sveltejs/adapter-static';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const pagesBase = process.env.PAGES_BASE || (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}` : '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
        // TODO: sveltekit PLEASE stop failing builds just because you couldnt find a url, missing urls literally dont matter to us at all
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: 'public',
            assets: 'public',
            fallback: '404.html',
            precompress: true,
            strict: true
        }),
        paths: {
            base: pagesBase,
        },
        prerender: {
            handleHttpError: "warn"
        }
    },
    compilerOptions: {
        runes: true,
    }
};

export default config;
