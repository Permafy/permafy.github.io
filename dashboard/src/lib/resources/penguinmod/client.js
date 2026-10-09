import { browser } from "$app/environment";
import { PUBLIC_API_URL } from "$lib/resources/site-env";
import { get } from "svelte/store";

// TODO: UNIMPORTANT: Should we claim "penguinmod" as the package name, or "@penguinmod/api"?
import { PenguinModAPI } from "penguinmod";

import StoreSettings from "$lib/stores/settings";

// NOTE: Need to fix the api url for ApiModule
// TODO: UNIMPORTANT: When .env is missing, this seems to give unhelpful errors that dont say the problem is .env exactly. Probably try to alert that before this loads?
const apiUrl = new URL(PUBLIC_API_URL);
apiUrl.pathname = "/api";

// get the current token so we dont need to use setToken everywhere (outside of auth at least)
let userToken = null;
if (browser) {
    const currentSettings = get(StoreSettings);
    if (currentSettings.loggedIn)
        userToken = currentSettings.token;
}

// make the cleint with the info we got earlier,,,
const PenguinModClient = new PenguinModAPI({
    apiUrl: apiUrl,
    token: userToken,
});
if (browser) {
    // TODO: UNIMPORTANT: Is it possible that adding our own telemetry is useful for the rampant malicious usage of the API?
    PenguinModClient.injectOptions = (options) => {
        // NOTE: we give some info that PM Home is what is using the apimodule right now
        return {
            headers: {
                "PenguinMod-Frontend": location.host,
                "PenguinMod-FrontendType": "PenguinMod-HomeNew",
            },
        };
    };
}

export default PenguinModClient;
