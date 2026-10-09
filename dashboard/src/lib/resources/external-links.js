import { PUBLIC_STUDIO_URL } from "$lib/resources/site-env";

export const addPenguinModUserId = (href, userId) => {
    const url = new URL(href);
    if (url.origin !== new URL(PUBLIC_STUDIO_URL).origin) return href;
    url.searchParams.set("pm_user_id", userId || "");
    return url.toString();
};

export default {
    /**
     * PenguinMod's editor page within the studio domain.
     * 
     * This should only be used in a context of "visit the editor" with no specific target
     */
    editor: `${PUBLIC_STUDIO_URL}/editor.html`,

    /**
     * PenguinMod's credits page
     */
    credits: `${PUBLIC_STUDIO_URL}/credits.html`,

    /**
     * PenguinMod's contact page
     */
    contact: `${PUBLIC_STUDIO_URL}/contact.html`,

    /**
     * Donation pages for sites
     */
    donate: {
        scratch: "https://www.scratchfoundation.org/donate",
        turbowarp: "https://github.com/sponsors/GarboMuffin"
    },

    /**
     * PenguinMod's packager page
     */
    packager: `${PUBLIC_STUDIO_URL}/PenguinMod-Packager/`,
    
    /**
     * PenguinMod's status page
     */
    status: "https://status.penguinmod.com/",

    /**
     * PenguinMod's official wiki
     */
    wiki: "https://wiki.penguinmod.com/wiki/Main_Page",

    /**
     * PenguinMod's Discord invite
     */
    discord: "https://discord.gg/NZ9MBMYTZh",

    /**
     * Scratch's website
     */
    scratch: "https://scratch.mit.edu",

    /**
     * TurboWarp's website
     */
    turbowarp: "https://turbowarp.org",

    /**
     * PenguinMod's github page
     */
    github: "https://github.com/PenguinMod/",

    /**
     * PenguinMod's issues page
     */
    // TODO: UNIMPORTANT: maybe we should make PenguinMod-Issues finally,,
    issues: "https://github.com/PenguinMod/PenguinMod-Home/issues",
}
