import { browser } from '$app/environment';

class Locale {
    static get browserLanguage() {
        // NOTE: we assume scraper, and scraper should get an en-US display
        if (!browser) return "en-US";
        return navigator.language;
    }

    /**
     * Formats a timestamp to the user's locale
     * @param {number} timestamp
     * @returns {string} en-US: June 9, 2026 at 9:06 PM
     */
    static timestampToDateWithTime(timestamp) {
        timestamp = Number(timestamp);
        return `${new Date(timestamp).toLocaleString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        })}`;
    }
    /**
     * Formats a timestamp to the user's locale
     * @param {number} timestamp
     * @returns {string} en-US: June 9, 2026
     */
    static timestampToDate(timestamp) {
        timestamp = Number(timestamp);
        return `${new Date(timestamp).toLocaleString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}`;
    }
    /**
     * Formats a timestamp to the user's locale
     * @param {number} timestamp
     * @returns {string} en-US: 9:06 PM
     */
    static timestampToTime(timestamp) {
        timestamp = Number(timestamp);
        return `${new Date(timestamp).toLocaleString([], {
            hour: "numeric",
            minute: "numeric",
        })}`;
    }
    /**
     * Formats a timestamp to look like a xx:xx:xx clock according to the user's locale
     * @param {number} timestamp
     * @returns {string} en-US: 09:22:27 PM
     */
    static timestampToClock(timestamp) {
        timestamp = Number(timestamp);
        return `${new Date(timestamp).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })}`;
    }

    /**
     * Formats a time represented in milliseconds to an upcoming date according to the user's locale
     * @param {number} milliseconds
     * @returns {string} en-US: in 55 weeks, in 2 days, in 7 hours, and in 39 minutes
     */
    static millisecondsToUpcoming(milliseconds) {
        milliseconds = Math.max(0, Number(milliseconds));
        let weeks   = Math.floor((milliseconds / (1000 * 60 * 60 * 24 * 7)));
        let days    = Math.floor((milliseconds / (1000 * 60 * 60 * 24)) % 7);
        let hours   = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        let seconds = Math.floor((milliseconds / 1000) % 60);

        const formatterWeeks   = new Intl.NumberFormat(this.browserLanguage, { style: "unit", unitDisplay: "long", unit: "week"   });
        const formatterDays    = new Intl.NumberFormat(this.browserLanguage, { style: "unit", unitDisplay: "long", unit: "day"    });
        const formatterHours   = new Intl.NumberFormat(this.browserLanguage, { style: "unit", unitDisplay: "long", unit: "hour"   });
        const formatterMinutes = new Intl.NumberFormat(this.browserLanguage, { style: "unit", unitDisplay: "long", unit: "minute" });
        const formatterSeconds = new Intl.NumberFormat(this.browserLanguage, { style: "unit", unitDisplay: "long", unit: "second" });
        
        const parts = [];
        if (weeks   > 0) parts.push(  formatterWeeks.format(weeks  , "weeks"  ));
        if (days    > 0) parts.push(   formatterDays.format(days   , "days"   ));
        if (hours   > 0) parts.push(  formatterHours.format(hours  , "hours"  ));
        if (minutes > 0) parts.push(formatterMinutes.format(minutes, "minutes"));

        // add seconds if there's nothing else
        if (parts.length <= 0) parts.push(formatterSeconds.format(seconds, "seconds"));
        return this.arrayToAndConjuction(parts);
    }

    /**
     * Formats a number to display delimiters for the user's locale
     * @param {number} number
     * @returns {string} en-US: 100,000
     */
    static numberWithDelimiter(number) {
        number = Number(number);
        return `${number.toLocaleString()}`;
    }
    /**
     * Formats a number to display with significant suffixes for the user's locale
     * @param {number} number
     * @returns {string} en-US: 1.5M
     */
    static numberWithNotation(number) {
        number = Number(number);
        const formatter = new Intl.NumberFormat(this.browserLanguage, { notation: "compact" });
        return formatter.format(number);
    }

    /**
     * Formats an array of strings to contain "and" conjuctions for the user's locale
     * @param {string[]} array
     * @returns {string} en-US: one, two, and three
     */
    static arrayToAndConjuction(array) {
        const formatter = new Intl.ListFormat(this.browserLanguage, { style: "long", type: "conjunction" });
        return formatter.format(array);
    }
    /**
     * Formats an array of strings to contain "or" conjuctions for the user's locale
     * @param {string[]} array
     * @returns {string} en-US: one, two, or three
     */
    static arrayToOrConjuction(array) {
        const formatter = new Intl.ListFormat(this.browserLanguage, { style: "long", type: "disjunction" });
        return formatter.format(array);
    }
}

export default Locale;