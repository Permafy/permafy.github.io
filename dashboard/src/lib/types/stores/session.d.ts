declare interface StoreSessionInterface {
    /** The last time the status endpoint was fetched */
    alertStatusCachedTime: number,
    /** The alerts that have been cached */
    alertStatusCachedAlerts: PenguinModBasicAPITypes.StatusUpdate[],

    /** User cache - last time the user info was actually fetched (reset on logout) */
    userCachedTime: number,
    /** User cache - The user's ID */
    userCachedId: string,
    /** User cache - The user's name (lowercase) */
    userCachedUsername: string,
    /** User cache - The user's name (displayed) */
    userCachedDisplayName: string,
    /** User cache - The user's bio (generally try not to depend on this) */
    // TODO: Replace this with translation strings to avoid fetching profile on login
    userCachedBio: string,
    /** User cache - The amount of unread messages the user has */
    userCachedUnreadCount: number,
    /** User cache - The user's rank */
    userCachedRank: number,
    /** User cache - Whether or not the user can rank up */
    userCachedCanRankUp: boolean,
    /** User cache - Whether or not the user is a supporter */
    userCachedSupporter: boolean,
    /** User cache - Whether or not the user is a moderator */
    userCachedMod: boolean,
    /** User cache - Whether or not the user is an admin */
    userCachedAdmin: boolean,
    // TODO: There are likely more fields that are worth caching like birthdayEntered & such

    /** User feed cache - last time the user feed was actually fetched */
    userFeedCachedTime: number,
    /** User feed cache - The fetched user feed */
    userFeedCachedData: FeedItem[], // TODO: Figure out how to get FeedItem here (TS lang server thinks it doesnt exist)

    /** The last time the basic API updates endpoint was fetched */
    frontpageUpdatesCachedTime: number,
    /** The basic API updates that have been cached */
    frontpageUpdatesCachedUpdates: PenguinModBasicAPITypes.Update[],
    
    /** The last time the frontpage endpoint was fetched */
    frontpageProjectsCachedTime: number,
    /** The basic API updates that have been cached */
    frontpageProjectsCachedResult: FrontPageResults, // TODO: Figure out how to get FrontPageResults here (TS lang server thinks it doesnt exist)
};
