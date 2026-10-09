import StoreSettings from "$lib/stores/settings";

import TranslationMapper from "$lib/resources/localization/translation/mapper";

/**
 * Makes a translated tooltip alt text
 * @param {TranslationIndex.Key} key The text string to grab
 * @returns {import('svelte/attachments').Attachment}
 */
function alt(key) {
    return (node) => {
        node.alt = TranslationMapper.mapCurrent(key);
        return;
    };
}

export default alt;