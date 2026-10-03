/* eslint-disable import/no-commonjs */

const RawSource = require('webpack-sources').RawSource;
const crypto = require('crypto');

const PLUGIN_NAME = 'TWGenerateServiceWorkerPlugin';
const SW_NAME = 'sw.js';
const INCLUDE_HTML = [
    'index.html',
    'editor.html',
    'editor/index.html',
    'playground.html',
    'playground/index.html',
    'fullscreen.html',
    'fullscreen/index.html',
    'embed.html',
    'embed/index.html',
    'addons.html',
    'addons/index.html',
    'credits.html',
    'credits/index.html'
];

const hash = object => crypto.createHash('sha1')
    .update(JSON.stringify(object))
    .digest('hex');

class TWGenerateServiceWorkerPlugin {
    apply (compiler) {
        const allAssetNames = new Set();
        compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {
            const newAssetNames = compilation.getAssets()
                .map(i => i.name);
            for (const name of newAssetNames) {
                allAssetNames.add(name);
            }
            const htmlAssets = [];
            const lazyAssets = [];
            const prettyHtmlAssets = [...allAssetNames]
                .filter(name => (
                    !name.includes('/') &&
                    name.endsWith('.html') &&
                    name !== 'index.html' &&
                    name !== '404.html'
                ))
                .map(name => `${name.slice(0, -'.html'.length)}/index.html`);
            for (const name of allAssetNames) {
                if (
                    // HTML
                    INCLUDE_HTML.includes(name)
                ) htmlAssets.push(name);
                else if (
                    // scratch-blocks
                    name.startsWith('static/blocks-media') &&
                    // Only used in horizontal mode
                    !name.includes('event_broadcast_') &&
                    !name.includes('event_when-broadcast-received_') &&
                    !name.includes('event_whenflagclicked') &&
                    // Useless without internet connection
                    !name.includes('wedo_') &&
                    !name.includes('set-led_') &&
                    !name.includes('microbit-block-icon') &&
                    !name.includes('wedo2-block-icon')
                ) lazyAssets.push(name);
                else if (
                    // other assets
                    name.startsWith('static/assets')
                ) lazyAssets.push(name);
                else if (
                    // JavaScript
                    name.startsWith('js/') &&
                    name.endsWith('.js') &&
                    !name.includes('worker') &&
                    !name.startsWith('js/embed') &&
                    !name.startsWith('js/credits') &&
                    !name.startsWith('js/library-')
                ) lazyAssets.push(name);
            }
            htmlAssets.push(...prettyHtmlAssets);
            const id = hash(allAssetNames);
            const workerFile = compilation.getAsset(SW_NAME);
            if (workerFile) {
                const workerSource = workerFile.source.source().toString();
                const newSource = workerSource
                    .replace('__HTML_ASSETS__', JSON.stringify(htmlAssets))
                    .replace('__LAZY_ASSETS__', JSON.stringify(lazyAssets))
                    .replace('__LAZY_ASSETS_NAME__', JSON.stringify(`tw-lazy-${id}`));
                compilation.updateAsset(SW_NAME, new RawSource(newSource));
            }
        });
    }
}

module.exports = TWGenerateServiceWorkerPlugin;
