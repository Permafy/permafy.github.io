import { browser } from '$app/environment';

import Locale from '$lib/resources/localization/locale.js';
import TranslationMapper from '$lib/resources/localization/translation/mapper.js';

import languageInfo from "$lib/resources/localization/translation/language/language-info.js";

class TranslationLoader {
    /**
     * Handles initialization of the specified language.
     * Can be ran multiple times (ex, swapping languages)
     * @param {TranslationIndex.LanguageCode} languageCode The language code to use for initialization.
     */
    static initialize(languageCode) {
        if (!browser) return;
        const intendedLanguage = TranslationMapper.mapSavedLanguageCode(languageCode);

        // NOTE: This does allow for ugly FOUC but hooopefully SvelteKit mitigates this with SPA? i really hope so & i havent seen any foreigners complain since legacy home does the same thing
        document.documentElement.dir = "ltr";
        if (languageInfo.languageRtl[intendedLanguage]) {
            document.documentElement.dir = "rtl";
        }
    }
}

export default TranslationLoader;
