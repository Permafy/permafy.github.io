/**
 * @fileoverview This script links the following modules to node_modules:
 * - PenguinMod-ApiModule (penguinmod)
 * - PenguinMod-MarkDownNew (PenguinMod-MarkDown)
 * - PenguinMod-SvelteUI
 *
 * How to use this:
 * - Download all the specified repos, and change the hardcoded URLs to the ones on your system
 * - Install all the dependencies for PM Home first
 * - Install all the dependencies for these modules
 * - For SvelteUI specifically, you need to recompile with `npm run prepack` each time you make changes
 * - MAKE SURE THAT the nodeModulesPath for all of these exist before running.
 *   - If you get an error about paths not existing, its likely that you ran the script once as non-admin/sudo, and you need to reinstall the modules for pm home to fix it
 * - Run this script with `node link-deps.cjs` as administrator
 *   - If you get an error about paths not existing, its likely that you ran the script once as non-admin/sudo, and you need to reinstall the modules for pm home to fix it
 *
 * For SvelteUI specifically, you need to recompile with `npm run prepack` each time you make changes
 */
/** */
require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");

console.log(
    "Linking with LOCAL Paths (asking for path. if you don't wanna deal with that stick it in .env), run this script as administrator/sudo if you have an issue",
);

// CONFIG
const pathPenguinModApiModule = process.env.PM_API_MODULE_PATH || readline.question("Path to API module (or empty if none): ");
const pathPenguinModMarkDownNew = process.env.PM_MARKDOWN_NEW_PATH || readline.question("Path to Markdown New (or empty if none): ");
const pathPenguinModSvelteUI = process.env.PM_SVELTE_UI_PATH || readline.question("Path to Svelte UI (or empty if none): ");
const nodeModulesPathPenguinModApiModule = path.join(
    __dirname,
    "node_modules/penguinmod",
);
const nodeModulesPathPenguinModMarkDownNew = path.join(
    __dirname,
    "node_modules/PenguinMod-MarkDown",
);
const nodeModulesPathPenguinModSvelteUI = path.join(
    __dirname,
    "node_modules/PenguinMod-SvelteUI",
);

// nodeModulesPathPenguinModApiModule
if (
    fs.existsSync(pathPenguinModApiModule) &&
    fs.existsSync(nodeModulesPathPenguinModApiModule)
) {
    fs.rmSync(nodeModulesPathPenguinModApiModule, {
        recursive: true,
        force: true,
    });
    fs.symlinkSync(pathPenguinModApiModule, nodeModulesPathPenguinModApiModule);
    console.log(
        "symlinked:",
        pathPenguinModApiModule,
        "to",
        nodeModulesPathPenguinModApiModule,
    );
} else {
    console.warn(
        "one of these is missing:",
        pathPenguinModApiModule,
        nodeModulesPathPenguinModApiModule,
    );
}
// nodeModulesPathPenguinModMarkDownNew
if (
    fs.existsSync(pathPenguinModMarkDownNew) &&
    fs.existsSync(nodeModulesPathPenguinModMarkDownNew)
) {
    fs.rmSync(nodeModulesPathPenguinModMarkDownNew, {
        recursive: true,
        force: true,
    });
    fs.symlinkSync(
        pathPenguinModMarkDownNew,
        nodeModulesPathPenguinModMarkDownNew,
    );
    console.log(
        "symlinked:",
        pathPenguinModMarkDownNew,
        "to",
        nodeModulesPathPenguinModMarkDownNew,
    );
} else {
    console.warn(
        "one of these is missing:",
        pathPenguinModMarkDownNew,
        nodeModulesPathPenguinModMarkDownNew,
    );
}
// nodeModulesPathPenguinModSvelteUI
if (
    fs.existsSync(pathPenguinModSvelteUI) &&
    fs.existsSync(nodeModulesPathPenguinModSvelteUI)
) {
    fs.rmSync(nodeModulesPathPenguinModSvelteUI, {
        recursive: true,
        force: true,
    });
    fs.symlinkSync(pathPenguinModSvelteUI, nodeModulesPathPenguinModSvelteUI);
    console.log(
        "symlinked:",
        pathPenguinModSvelteUI,
        "to",
        nodeModulesPathPenguinModSvelteUI,
    );
} else {
    console.warn(
        "one of these is missing:",
        pathPenguinModSvelteUI,
        nodeModulesPathPenguinModSvelteUI,
    );
}
