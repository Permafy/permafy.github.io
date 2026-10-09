import { browser } from "$app/environment";
import { get } from "svelte/store";

import Locale from "$lib/resources/localization/locale.js";

import StoreSettings from "$lib/stores/settings";

import languageInfo from "$lib/resources/localization/translation/language/language-info.js";
import languageDatabase from "$lib/resources/localization/translation/language/language-database.js";

class TranslationMapper {
    /**
     * Map a `TranslationIndex.Key` to `TranslationIndex.Text` depending on the `TranslationIndex.LanguageCode` provided.
     * @param {TranslationIndex.Key} key Which text string to grab.
     * @param {TranslationIndex.LanguageCode} langCode Defaults to `"en"` English text.
     * @param {TranslationIndex.Text | null} defaultText Text to fallback to if no translation exists.
     * @returns {TranslationIndex.Text} The text string in the specified language.
     */
    static map(key, langCode = "en", defaultText = "Missing translation") {
        const language = languageDatabase[langCode] || languageDatabase.en;
        const langText = language[key];
        if (langText) return langText;
        
        const englishText = languageDatabase.en[key];
        return englishText || defaultText;
    }
    /**
     * Map a `TranslationIndex.Key` to `TranslationIndex.Text` depending on the current language code.
     * 
     * In general, this is the function that should be used across the codebase for translating text
     * outside of LocalizedString or other helpers.
     * @param {TranslationIndex.Key} key Which text string to grab.
     * @param {TranslationIndex.Text | null} defaultText Text to fallback to if no translation exists.
     * @returns {TranslationIndex.Text} The text string in the specified language.
     */
    static mapCurrent(key, defaultText = "Missing translation") {
        const languageCode = browser ? get(StoreSettings).appLanguage : "en";
        return this.map(key, languageCode, defaultText);
    }

    /**
     * Maps a language code to one that we support.
     * @param {string} langCode The language code to map to a known language.
     * @returns {TranslationIndex.LanguageCode} The closest language code to the specified one that we support.
     */
    static mapLanguageCode(langCode) {
        // see if this language code is known exactly
        if (languageInfo.languageOrder.includes(langCode)) {
            return langCode;
        }
        if (langCode in languageInfo.languageAlternative) {
            return languageInfo.languageAlternative[langCode];
        }

        // see if we just need to split the language code
        const topLevelLang = langCode.split('-').shift();
        if (languageInfo.languageOrder.includes(topLevelLang)) {
            return topLevelLang;
        }
        if (topLevelLang in languageInfo.languageAlternative) {
            return languageInfo.languageAlternative[topLevelLang];
        }

        // we dont know this language
        return "en";
    }
    /**
     * Maps a saved language code to one that we support.
     * `"browser"` is reserved for "Same as browser" language.
     * @param {"browser" | string | null} savedLanguageCode The language code to map. The browser's language is default.
     * @returns {TranslationIndex.LanguageCode} The closest language code to the specified one that we support.
     */
    static mapSavedLanguageCode(savedLanguageCode) {
        const browserLanguage = Locale.browserLanguage;
        if ((!savedLanguageCode) || (savedLanguageCode === "browser")) savedLanguageCode = browserLanguage;
        if (typeof savedLanguageCode !== "string") throw new Error("Saved language code is not a string (likely invalid settings)");
        return this.mapLanguageCode(savedLanguageCode);
    }
}

export default TranslationMapper;
