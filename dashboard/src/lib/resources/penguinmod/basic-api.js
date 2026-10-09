import { PUBLIC_BASIC_API_URL } from "$lib/resources/site-env";

import externalLinks from "$lib/resources/external-links.js";

class PenguinModBasicAPI {
    /**
     * Gets the current status updates.
     * 
     * Only returns a single active update if present as of now, but should ideally be
     * built to be compatible for multiple inactive and active status updates.
     * @returns {Promise<PenguinModBasicAPITypes.StatusUpdate[]>}
     */
    static async statusUpdates() {
        const url = new URL(PUBLIC_BASIC_API_URL);
        url.pathname = "/status";

        // do the fetch on the diff path
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(await response.text());
        const json = await response.json();
        // TODO: UNIMPORTANT: BasicAPI should support having a history of status updates, and maybe multiple active? (that might not be necessary)
        // TODO: UNIMPORTANT: BasicAPI should support being able to link to other websites (or no website) rather than only the status page 
        // NOTE: if this api ever updates to returns an array then return that directly
        return json.type === "empty" ? [] : [{
            // NOTE: this is extra info that maybe the api should return later
            id: `temporary id ${json.text}`,
            active: true,
            detail: externalLinks.status,
            date: Date.now(),
            // dump the rest of update here
            ...json,
        }];
    }
    
    /**
     * Gets the current PenguinMod updates and formats them for display.
     * 
     * Only returns a single update as of now, but should ideally be
     * built to be compatible for multiple updates for a "changelog" esque menu.
     * @returns {Promise<PenguinModBasicAPITypes.Update[]>}
     */
    static async updates() {
        const url = new URL(PUBLIC_BASIC_API_URL);
        url.pathname = "/updates";

        // do the fetch on the diff path
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(await response.text());
        const json = await response.json();
        // TODO: UNIMPORTANT: BasicAPI should support having a history of site updates
        // TODO: UNIMPORTANT: BasicAPI should probably return headline & content itself
        // NOTE: if this api ever updates to returns an array then return that directly
        return [json].map(update => {
            const cleanContent = `${update.cleanContent || update.content}`;
            const sentenceEnd = cleanContent.search(/[\.\?!]/i);
            const headline = cleanContent.slice(0, sentenceEnd + cleanContent.slice(sentenceEnd).search(/\s/)).trim();
            const content = cleanContent.slice(sentenceEnd + cleanContent.slice(sentenceEnd).search(/\s/)).trim();
            // TODO: remove wacky stuff in the interface like guildId and channelId
            return {
                id: update.id,
                guildId: update.guildId ? update.guildId : null,
                channelId: update.channelId ? update.channelId : null,
                createdTimestamp: update.createdTimestamp,
                editedTimestamp: update.editedTimestamp ? update.editedTimestamp : null,
                authorId: update.authorId ? update.authorId : null,
                authorName: update.authorName ? update.authorName : null,
                authorImage: update.authorImage ? update.authorImage : null,
                headline: headline,
                content: content,
                rawContent: cleanContent,
                image: update.image ? update.image : null,
            };
        });
    }
}

export default PenguinModBasicAPI;
