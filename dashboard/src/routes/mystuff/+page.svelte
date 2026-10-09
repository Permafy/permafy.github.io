<script>
    import { browser } from "$app/environment";
    import { PUBLIC_STUDIO_URL } from "$lib/resources/site-env";

    import { PenguinModAPIError } from "penguinmod";

    // components
    import { Project } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import LocalizedAlt from "$lib/components/Localization/LocalizedAlt.svelte";
    import LocalizedString from "$lib/components/Localization/LocalizedString.svelte";
    import LocalizedTooltip from "$lib/components/Localization/LocalizedTooltip.svelte";

    import CacheHelper from "$lib/resources/cache/cache-helper";
    import PenguinModClient from "$lib/resources/penguinmod/client";

    import StateApplication from "$lib/state/app.svelte";
    import StoreSettings from "$lib/stores/settings.js";
    import StoreSession from "$lib/stores/session";
</script>

<div class="listings-header">
    <h1>
        <LocalizedString
            text="My Stuff"
            key="mystuff.title"
        />
    </h1>
    {#if StateApplication.loggedInProcessed}
        <!-- TODO: IMPORTANT: This needs to be translated -->
        <p>67 projects</p>
    {/if}
</div>
{#if !StateApplication.loggedInProcessed}
    TODO: ladspiner
{:else}
    <!-- TODO: add featuerd porjefts or something hjere  -->
    <select disabled>
        <option>
            <LocalizedString
                text="All projects"
                key="profile.projects.all"
            />
        </option>
    </select>
{/if}

<style>
    .listings-header {
        width: 100%;
        height: 10em;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        color: white;
        background: #8cafffb0;
        overflow: hidden;
    }
    .listings-header h1 {
        margin-block: 4px;

        font-size: 3em;
    }
    .listings-header p {
        margin-block: 4px;
    }
</style>