/**
 * Handles automatic translation of English text to another language.
 */
class Translator {
    /**
     * The list of language codes supported by the translation API we use.
     * 
     * Currently, these should match the Scratch Translation API languages.
     */
    static languageCodes = [
        'en',
        'cy',
        'zu',
        'ko',
        'az',
        'he',
        'mk',
        'am',
        'mr',
        'cs',
        'zh-cn',
        'la',
        'nn',
        'my',
        'ga',
        'es',
        'nl',
        'zh-tw',
        'pt-br',
        'kn',
        'uz',
        'ja',
        'is',
        'sk',
        'ht',
        'bg',
        'de',
        'gd',
        'et',
        'fi',
        'ar',
        'hu',
        'mt',
        'ro',
        'fa',
        'hi',
        'eo',
        'lt',
        'it',
        'el',
        'mi',
        'hr',
        'ca',
        'th',
        'hy',
        'id',
        'eu',
        'da',
        'ru',
        'sr',
        'gl',
        'lv',
        'nb',
        'tr',
        'fr',
        'sv',
        'sl',
        'ml',
        'be',
        'pl',
        'pt',
        'ku',
        'sq',
        'ms',
        'vi',
        'te',
        'uk',
        'mn',
        'es-419',
        'ja-hira'
    ];

    /**
     * Maps a provided language code to a language supported by the translation API.
     * Note that PenguinMod-Home supports different language codes from the translation API.
     * @param {string} lc The language code.
     * @returns {string} The closest language code, or `"en"` if entirely unsupported.
     */
    static getClosestLanguageCode(lc) {
        if (typeof lc !== 'string') return 'en';
        lc = lc.toLowerCase();
        if (this.languageCodes.includes(lc)) return lc;
        const split = lc.split('-');
        if (this.languageCodes.includes(split[0])) return split[0];
        return 'en';
    }
    // TODO: We should probably cache translated text somewhere
    // TODO: UNIMPORTANT: Do we need a, isTranslationAvailable endpoint, to determine if the language is non-english AND supported?

    /**
     * Translates a string of text using a translation API. It is not necessary to run `getClosestLanguageCode` before running this.
     * @param {string} text The string of text to translate.
     * @param {string | null} lc The language code. Will be mapped to the closest language code for the translation API.
     * @returns {string} The translated string of text.
     */
    static async translate(text, lc = "en") {
        const languageCode = this.getClosestLanguageCode(lc);
        const res = await fetch(`https://trampoline.turbowarp.org/translate/translate?language=${encodeURIComponent(languageCode)}&text=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json);
        return json.result;
    }
}

export default Translator;