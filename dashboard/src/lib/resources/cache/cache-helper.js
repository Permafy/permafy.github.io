import { browser } from "$app/environment";
import { get } from "svelte/store";

import StoreSession, { defaultSession } from "$lib/stores/session";

class CacheHelper {
    /**
     * Sets new information in the StoreSession.
     * @param {StoreSessionInterface} newData Partial of StoreSessionInterface to overwrite
     */
    static update(newData) {
        if (!browser) return;

        // hyea
        const currentSession = get(StoreSession);
        const newSession = {
            ...currentSession,
            ...newData,
        };

        // set cache times if not specified
        // NOTE: Any future additions to the session cache should add a Time entry, and account for it here
        const newDataKeys = Object.keys(newData);
        if (!newDataKeys.includes("alertStatusCachedTime") && newDataKeys.find(key => key.startsWith("alertStatusCached")))
            newSession.alertStatusCachedTime = Date.now();
        if (!newDataKeys.includes("userCachedTime") && newDataKeys.find(key => key.startsWith("userCached")))
            newSession.userCachedTime = Date.now();
        if (!newDataKeys.includes("userFeedCachedTime") && newDataKeys.find(key => key.startsWith("userFeedCached")))
            newSession.userFeedCachedTime = Date.now();
        if (!newDataKeys.includes("frontpageUpdatesCachedTime") && newDataKeys.find(key => key.startsWith("frontpageUpdatesCached")))
            newSession.frontpageUpdatesCachedTime = Date.now();
        if (!newDataKeys.includes("frontpageProjectsCachedTime") && newDataKeys.find(key => key.startsWith("frontpageProjectsCached")))
            newSession.frontpageProjectsCachedTime = Date.now();

        // save that
        StoreSession.set(newSession);
    }

    /**
     * Resets the entire session/cache.
     * If you only want to specify specific keys to reset, give a partial StoreSessionInterface where the values are truthy, such as:
     * 
     * ```js
     * CacheHelper.reset({ userCachedId: true });
     * ```
     * @param {StoreSessionInterface?} specificKeys Partial of StoreSessionInterface. Define a truthy value for the keys you want to reset like, `{ userCachedId: true }`
     */
    static reset(specificKeys) {
        if (!browser) return;
        if (!specificKeys) {
            StoreSession.set(defaultSession);
            return;
        }

        // reset only truthy keys
        const currentSession = get(StoreSession);
        const newSession = { ...currentSession };
        for (const key in specificKeys) {
            const shouldDelete = !!specificKeys[key];
            if (!shouldDelete) continue;
            newSession[key] = defaultSession[key];
        }

        StoreSession.set(newSession);
    }

    /**
     * Checks if a specific cache category has expired.
     * @param {string} cacheTimeKey The key in StoreSession representing the timestamp (e.g., 'userCachedTime')
     * @param {number} threshold The duration in ms before cache expires
     * @returns {boolean} True if the cache is older than the threshold
     */
    static isExpired(cacheTimeKey, threshold) {
        if (!browser) return true;
        const currentSession = get(StoreSession);
        const elapsedTime = Date.now() - currentSession[cacheTimeKey];
        return elapsedTime >= threshold;
    }
}

export default CacheHelper;
