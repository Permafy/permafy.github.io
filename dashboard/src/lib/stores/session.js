import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import tryCatch from '$lib/resources/try-catch';

/**
 * @type {StoreSessionInterface}
 */
export const defaultSession = {
    alertStatusCachedTime: 0,
    alertStatusCachedAlerts: [],

    userCachedTime: 0,
    userCachedId: "",
    userCachedUsername: "",
    userCachedDisplayName: "",
    userCachedBio: "", // TODO: Remove (see  todo elsewhere)
    userCachedUnreadCount: 0,
    userCachedRank: 0,
    userCachedCanRankUp: false,
    userCachedSupporter: false,
    userCachedMod: false,
    userCachedAdmin: false,
    
    userFeedCachedTime: 0,
    userFeedCachedData: [],

    frontpageUpdatesCachedTime: 0,
    frontpageUpdatesCachedUpdates: [],

    frontpageProjectsCachedTime: 0,
    frontpageProjectsCachedResult: {},
};

// NOTE: uses sessionStorage
// TODO: Session storage might be different between tabs.. thats a problem. Probably we will use BroadcastChannel to tell other tabs what the right info is on set.
const session = writable(defaultSession);
if (browser) {
    const stringStored = sessionStorage.getItem('pm:session');
    const saved = tryCatch(() => JSON.parse(stringStored));
    if (saved) {
        // NOTE: Make sure we fallback to defaults if the stored data is missing some keys
        session.set({
            ...defaultSession,
            ...(saved ?? {}),
        });

        // NOTE: We use document events incase we have a reason to listen to these updates outside of Svelte
        document.dispatchEvent(new CustomEvent("penguinmod-store-session-updated"));
    }
    session.subscribe((value) => {
        sessionStorage.setItem('pm:session', JSON.stringify(value));
        document.dispatchEvent(new CustomEvent("penguinmod-store-session-updated"));
    });
}

// NOTE: UNIMPORTANT: Should we just rename this to StoreSession to match every usage of it?
export default session;