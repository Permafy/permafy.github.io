<script>
    import { browser } from "$app/environment";

    import { PenguinModAPIError } from "penguinmod";

    // Components
    import PenguinActionIndicator from "$lib/components/PenguinActionIndicator.svelte";
    
    import TranslationLoader from "$lib/resources/localization/translation/loader.js";
    import Authenticator from "$lib/resources/penguinmod/authentication/authenticator.js";

    import StateApplication from "$lib/state/app.svelte";
    import StoreSettings from "$lib/stores/settings.js";
    import StoreSession from "$lib/stores/session.js";

    let { children } = $props();
    
    // Initialize translations by default.
    $effect(() => {
        const activeLanguage = $StoreSettings.appLanguage;
        TranslationLoader.initialize(activeLanguage);
    });
    // Do some checking & processing of the login state, and then telling the other pages that it's safe to touch it
    $effect(async () => {
        // if we are logged in, we: need to check for cache expiry; update cache if so; if cache update failed, see if we got logged out
        if ($StoreSettings.loggedIn) {
            try {
                await Authenticator.updateOutdatedUserInfo();
            } catch (err) {
                // assume we got logged out if Reauthenticate
                if (err instanceof PenguinModAPIError && err.message === "Reauthenticate") {
                    await Authenticator.logout();
                } else {
                    console.error(err);
                }
            }
        }

        // when loggedInProcessed is true, it's safe to start using user cache & user token, likely just any user stuff
        StateApplication.loggedInProcessed = true;
    });
</script>

{#if browser && StateApplication.penguinActionIndicator}
    <PenguinActionIndicator />
{/if}
<main>
    {@render children()}
</main>

<style>
    main {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        
        /* TODO: The navbar should not be above the scrollbar */
        overflow: auto;
    }
    :global(body.app-theme-dark) main {
        background: #111;
        color: white;
    }
    :global(body.app-theme-amoled) main {
        /* why is black not #000? ive been lied to */
        background: #000;
        color: white;
    }

</style>