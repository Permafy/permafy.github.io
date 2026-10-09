import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import tryCatch from '$lib/resources/try-catch';

/**
 * @type {StoreSettingsInterface}
 */
export const defaultSettings = {
    loggedIn: false,
    token: "",

    appTheme: "dark",
    appAccent: "cyan",
    appLanguage: "browser",

    alertDismissed: [],
    alertStatusDismissed: [],
};

// NOTE: uses localStorage
const settings = writable(defaultSettings);
if (browser) {
    const stringStored = localStorage.getItem('pm:settings');
    const saved = tryCatch(() => JSON.parse(stringStored));
    if (saved) {
        // NOTE: Make sure we fallback to defaults if the stored data is missing some keys
        settings.set({
            ...defaultSettings,
            ...(saved ?? {}),
            appTheme: "dark",
        });

        // NOTE: We use document events incase we have a reason to listen to these updates outside of Svelte
        document.dispatchEvent(new CustomEvent("penguinmod-store-settings-updated"));
    }
    settings.subscribe((value) => {
        localStorage.setItem('pm:settings', JSON.stringify({
            ...value,
            appTheme: "dark",
        }));
        document.dispatchEvent(new CustomEvent("penguinmod-store-settings-updated"));
    });
}

// NOTE: UNIMPORTANT: Should we just rename this to StoreSettings to match every usage of it?
export default settings;