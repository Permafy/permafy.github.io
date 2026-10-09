import path from 'path';

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    optimizeDeps: {
        include: [
            'PenguinMod-SvelteUI',
            'penguinmod'
        ],
        force: true
    },
    ssr: {
        external: [
            'penguinmod'
        ],
    },
    server: {
        watch: {
            ignored: [
                '!**/node_modules/PenguinMod-SvelteUI/**',
                '!**/node_modules/PenguinMod-SvelteUI/dist/index.js',
            ]
        }
    },
    resolve: {
        alias: {
            'PenguinMod-SvelteUI': path.resolve('node_modules/PenguinMod-SvelteUI/dist/index.js')
        }
    }
});
