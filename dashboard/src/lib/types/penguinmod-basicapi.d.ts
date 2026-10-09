declare namespace PenguinModBasicAPITypes {
    /**
     * Represents a current (active) or previous (not active) status update.
     */
    interface StatusUpdate {
        /**
         * The unique identifier for this update.
         */
        id: string;

        /**
         * Whether or not this status update is active, like ongoing maintenance or unexpected errors.
         */
        active: boolean;

        /**
         * The type of update that this is.
         */
        type: "warn";

        /**
         * The text for this update.
         */
        text: string;

        /**
         * The URL attached to this update.
         */
        detail?: string;

        /**
         * The date time in milliseconds that this update was sent.
         */
        date: number;
    }

    /**
     * Represents a PenguinMod update announcement.
     */
    interface Update {
        /** The unique identifier for this update. Generally this is a Discord message ID. */
        id: string;

        /** The identifier for the guild. This should not be relied on, and may be `""` regardless of input. */
        guildId?: string;

        /** The identifier for the channel where this update was posted. This should not be relied on. */
        channelId?: string;

        /** The Unix timestamp (in milliseconds) of when the update was originally created. */
        createdTimestamp: number;

        /** The Unix timestamp (in milliseconds) of when the update was last modified. This should not be relied on. */
        editedTimestamp?: number;

        /** The unique identifier of the user who authored the update. This should not be relied on. */
        authorId?: string;

        /** The display name of the author. This should not be relied on. */
        authorName?: string;

        /** A URL string pointing to the author's profile image. This should not be relied on. */
        authorImage?: string;

        /** The headline for this update. If not specifically given, this will be derived from sentence endings. If the update is a single sentence, this'll be blank or undefined. */
        headline?: string;

        /** The rest of the text content of the update. If the update is a single sentence, it'll be present here. */
        content: string;

        /** The raw text content of the update, if automatic headline grabbing is not desired. */
        rawContent: string;

        /** An optional URL string pointing to an image associated with the update. */
        image?: string | null;
    }
}
