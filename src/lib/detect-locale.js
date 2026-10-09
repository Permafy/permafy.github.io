/**
 * @fileoverview
 * Utility function to detect locale from saved settings or a URL parameter.
 */

import queryString from 'query-string';

// tw: read language from localStorage
export const LANGUAGE_KEY = 'tw:language';

/**
 * Look for a saved language setting, then a URL parameter, otherwise use English.
 * @param {Array.string} supportedLocales An array of supported locale codes.
 * @return {string} the preferred locale
 */
const detectLocale = supportedLocales => {
    // tw: read language from localStorage
    try {
        const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (storedLanguage && supportedLocales.includes(storedLanguage)) {
            return storedLanguage;
        }
    } catch (e) { /* ignore */ }

    const locale = 'en';
    const queryParams = queryString.parse(location.search);
    // Flatten potential arrays and remove falsy values
    const potentialLocales = [].concat(queryParams.locale, queryParams.lang).filter(l => l);
    if (!potentialLocales.length) {
        return locale;
    }

    const urlLocale = potentialLocales[0].toLowerCase();
    if (supportedLocales.includes(urlLocale)) {
        return urlLocale;
    }

    return locale;
};

export {
    detectLocale
};
