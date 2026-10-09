<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { PUBLIC_STUDIO_URL } from "$lib/resources/site-env";
    import { addPenguinModUserId } from "$lib/resources/external-links";

    // components
    import { Category, UserDisplay } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import LocalizedAlt from "$lib/components/Localization/LocalizedAlt.svelte";
    import LocalizedString from "$lib/components/Localization/LocalizedString.svelte";
    
    import { CACHE_USER_FEED } from "$lib/resources/cache/cache-time";
    import CacheHelper from "$lib/resources/cache/cache-helper";

    import TranslationMapper from "$lib/resources/localization/translation/mapper";
    import PenguinModClient from "$lib/resources/penguinmod/client.js";
    import Locale from "$lib/resources/localization/locale";
    
    import StoreSettings from "$lib/stores/settings";
    import StoreSession from "$lib/stores/session";
    
    let props = $props();
    let loading = $state(true);
    let failed = $state(false);
    const loadingAttempt = async () => {
        // NOTE: We only actually ask the API if our own cache is expired (or doesnt exist, which is also counted as expired)
        if (!CacheHelper.isExpired("userFeedCachedTime", CACHE_USER_FEED)) return;

        const myFeed = await PenguinModClient.users.getMyFeed();
        CacheHelper.update({
            userFeedCachedData: myFeed,
        });
    };
    onMount(async () => {
        if (!($StoreSettings.loggedIn)) return;
        
        try {
            await loadingAttempt();
        } catch (err) {
            console.error(err);
            failed = true;
        } finally {
            loading = false;
        }
    });

    // text handlers
    const getFeedText = (type, author, content) => {
        switch (type) {
            // TODO: At some point we should stop including removed projects in the feed.
            case "follow":
                return TranslationMapper.mapCurrent("feed.following", "$1 followed you")
                    .replaceAll("$1", author);
            case "upload":
                return TranslationMapper.mapCurrent("feed.uploaded", "$1 uploaded $2")
                    .replaceAll("$1", author)
                    .replaceAll("$2", content.name || TranslationMapper.mapCurrent("project.status.removed", "(removed)"));
            case "remix":
                return TranslationMapper.mapCurrent("feed.remixed", "$1 remixed $2")
                    .replaceAll("$1", author)
                    .replaceAll("$2", content.name || TranslationMapper.mapCurrent("project.status.removed", "(removed)"));
            case "posted":
                return TranslationMapper.mapCurrent("feed.posted", "$1 made a post")
                    .replaceAll("$1", author);
        }
    };
    const getFeedUrl = (type, author, content) => {
        switch (type) {
            case "upload":
            case "remix":
                return addPenguinModUserId(
                    `${PUBLIC_STUDIO_URL}/#${content.id}`,
                    $StoreSettings.loggedIn ? $StoreSession.userCachedId : ""
                );
            case "posted":
                // TODO: UNIMPORTANT: posts arent really planned for PM, and if they are added, do we really want them all to appear on the profile page?
                return `/profile/${author}?post=${content.id}`;
            default:
                // TODO: /profile/author must be valid
                return `/profile/${author}`;
        }
    };
</script>

<Category {...props}>
    <!-- My Feed Category -->
    {#snippet header()}
        <LocalizedString
            text="My Feed"
            key="home.sections.feed"
        />
    {/snippet}
    {#if !($StoreSettings.loggedIn)}
        <!-- NOTE: This state should never render, but we'll handle it nicely anyways -->
        <div class="category-textdisplay">
            <p>
                <Icon style="font-size:48px">chat_error</Icon>
            </p>
            <p>
                <LocalizedString
                    text="You are not properly logged in to access this page."
                    key="navigation.error.401"
                />
            </p>
        </div>
    {:else}
        {#if loading}
            <div class="category-textdisplay">
                <LoadingSpinner />
            </div>
        {:else if failed}
            <div class="category-textdisplay" style="color:red">
                <p>
                    <img
                        src={`${base}/asset/penguin/mailboxfull.svg`}
                        alt="Whoops! Our server's having some problems. Try again later."
                        {@attach LocalizedAlt("home.server.error")}
                    />
                </p>
                <p>
                    <LocalizedString
                        text="Whoops! Our server's having some problems. Try again later."
                        key="home.server.error"
                    />
                </p>
            </div>
        {:else}
            <div class="category-feed">
                {#each $StoreSession.userFeedCachedData as feedItem}
                    <!-- TODO: User display should allow 3 hrefs for the user pfp & bottom text (though we only need the image url to go elsewhere here) -->
                    <UserDisplay
                        src={PenguinModClient.users.getPfpUrl(feedItem.username)}
                        href={getFeedUrl(feedItem.type, feedItem.username, feedItem.data)}
                        title={getFeedText(feedItem.type, feedItem.username, feedItem.data)}
                        kind="detail"
                    >
                        {#snippet textTop()}
                            {getFeedText(feedItem.type, feedItem.username, feedItem.data)}
                        {/snippet}
                        {#snippet textBottom()}
                            {Locale.timestampToDateWithTime(Number(new Date(feedItem.date)))}
                        {/snippet}
                    </UserDisplay>
                {:else}
                    <div class="category-textdisplay">
                        <p>
                            <img
                                src={`${base}/asset/penguin/mailbox.svg`}
                                alt="Nothing yet!"
                                {@attach LocalizedAlt("generic.noneyet")}
                            />
                        </p>
                        <p>
                            <!-- TODO: UNIMPORTANT: This should be like "Seems like no one's home. Follow more users, and their activity will appear here." -->
                            <LocalizedString
                                text="Nothing yet!"
                                key="generic.noneyet"
                            />
                        </p>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</Category>

<style>
    .category-textdisplay {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .category-textdisplay p {
        margin-block: 4px;
    }

    .category-feed {
        width: 100%;
        height: 100%;

        overflow: hidden;
        overflow-y: auto;
    }
    .category-feed :global(div[data-penguinmodsvelteui-userdisplay=true]) {
        margin-bottom: 4px;
    }
    .category-feed :global(div[data-penguinmodsvelteui-userdisplay=true]:last-child) {
        margin-bottom: 0;
    }
</style>
