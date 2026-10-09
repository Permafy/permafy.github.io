// NOTE: Any future additions to the session cache should add a cache-time entry
// NOTE: We are allowed to reset cached data before this time, especially for settings updates or specific interactions
/**
 * How long to cache logged-in user info for.
 */
export const CACHE_USER_INFO = 1 * 60 * 60 * 1000; // 1 hour

/**
 * How long to cache user feed for.
 */
export const CACHE_USER_FEED = 1 * 60 * 1000; // 1 minutes

/**
 * How long to cache front page "What's New?" updates for.
 */
export const CACHE_BASIC_API_UPDATES = 10 * 60 * 1000; // 10 minutes

/**
 * How long to cache status updates for.
 */
export const CACHE_BASIC_API_STATUS = 5 * 60 * 1000; // 5 minutes

/**
 * How long to cache front page projects for.
 */
export const CACHE_FRONTPAGE_PROJECTS = 5 * 60 * 1000; // 5 minutes
