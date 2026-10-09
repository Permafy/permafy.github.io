import StoreSettings from "$lib/stores/settings";

import TranslationMapper from "$lib/resources/localization/translation/mapper";

/**
 * Makes a translated tooltip attachment
 * @param {TranslationIndex.Key} key The text string to grab
 * @returns {import('svelte/attachments').Attachment}
 */
function tooltip(key) {
    return (node) => {
        node.title = TranslationMapper.mapCurrent(key);
        return;
    };
}

export default tooltip;