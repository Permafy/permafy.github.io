<script>
    import { browser } from "$app/environment";
    import { base } from "$app/paths";
    import { PUBLIC_STUDIO_URL } from "$lib/resources/site-env";

    import { PenguinModAPIError } from "penguinmod";

    // components
    import { Button, Category, SwappableHolder, Project } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
    import MyFeed from "$lib/components/CategoryHome/MyFeed.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import WhatsNew from "$lib/components/CategoryHome/WhatsNew.svelte";
    import PenguinNews from "$lib/components/CategoryHome/PenguinNews.svelte";
    import LocalizedString from "$lib/components/Localization/LocalizedString.svelte";
    import LocalizedAlt from "$lib/components/Localization/LocalizedAlt.svelte";
    import LocalizedTooltip from "$lib/components/Localization/LocalizedTooltip.svelte";

    import { CACHE_FRONTPAGE_PROJECTS } from "$lib/resources/cache/cache-time";
    import CacheHelper from "$lib/resources/cache/cache-helper";
    import TranslationMapper from "$lib/resources/localization/translation/mapper";
    import PenguinModClient from "$lib/resources/penguinmod/client";

    import StateApplication from "$lib/state/app.svelte";
    import StoreSettings from "$lib/stores/settings.js";
    import StoreSession from "$lib/stores/session";

    import externalLinks, { addPenguinModUserId } from "$lib/resources/external-links";

    // front page project listings
    let frontPageLoading = $state(true);
    let frontPageError = $state(null);
    let frontPageRatelimited = $state(false);
    const loadingAttempt = async () => {
        if (!CacheHelper.isExpired("frontpageProjectsCachedTime", CACHE_FRONTPAGE_PROJECTS)) return;

        const frontPage = await PenguinModClient.projects.getFrontPage();
        CacheHelper.update({
            frontpageProjectsCachedResult: frontPage,
        });
    };
    $effect(async () => {
        // NOTE: Front page shows more if logged in and mod
        if (!StateApplication.loggedInProcessed) return;

        try {
            await loadingAttempt();
        } catch (err) {
            console.error(err);
            frontPageError = err;
            frontPageRatelimited = (err instanceof PenguinModAPIError) && err.httpCode === 429;
        } finally {
            frontPageLoading = false;
        }
    });
</script>

<main>
    <!-- onboarding banner (logged out only) -->
    {#if !StateApplication.loggedInProcessed || !($StoreSettings.loggedIn)}
        <!-- TODO: UNIMPORTANT: Consider redesigning the onboarding to: not mention platforms as a key part; be a bit more engaging; actually differ in design from the original by a bit? -->
        <div class="section-onboarding">
            <div class="section-onboarding-studio">
                <div class="section-onboarding-studio-inner">
                    <p>
                        <LocalizedString
                            text="Block-based coding website based on Scratch with tons of new features."
                            key="home.introduction1"
                        />
                    </p>
                    <p>
                        <LocalizedString
                            text="Built off of PenguinMod, GaiaMod, Snail IDE, NitroBolt, TurboWarp and Scratch."
                            key="home.introduction2"
                        />
                    </p>
                    <Button
                        icon={`${base}/asset/icons/blocks-blue.svg`}
                        kind="highlighted"
                        href={addPenguinModUserId(externalLinks.editor, $StoreSettings.loggedIn ? $StoreSession.userCachedId : "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="#8cafff"
                        style="outline-color: #8cafff59;"
                    >
                        <LocalizedString
                            text="Try it out"
                            key="home.tryout"
                        />
                    </Button>
                </div>
            </div>
            <div class="section-onboarding-showoff">
                <div class="section-onboarding-showoff-inner">
                    {#if !StateApplication.loggedInProcessed}
                        <img
                            src={`${base}/asset/penguin/large/frontpage.svg`}
                            alt="PenguinMod"
                        />
                    {:else if !($StoreSettings.loggedIn)}
                        <!-- TODO: Add a wrapper around this where the video doesnt literally embed til you click or something so we can display YouTube privacy disclaimer -->
                        <iframe
                            class="section-onboarding-showoff-inner-video"
                            width="560"
                            height="315"
                            src="https://www.youtube-nocookie.com/embed/11mfClA21-Y"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                            frameborder="0"
                        ></iframe>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    <!-- Translation banner -->
    {#if browser && TranslationMapper.mapSavedLanguageCode($StoreSettings.appLanguage) !== "en"}
        <div class="section-language-warning">
            <Icon>translate</Icon>
            <div style="width:4px;"></div>
            <p>
                <LocalizedString
                    text="PenguinMod is made by English-speaking developers. Expect minor issues and sorry for any translation errors."
                    key="translation.warning"
                />
            </p>
        </div>
    {/if}

    <!-- Scratch Note -->
    <p class="section-scratchnote">
        <LocalizedString
            text="Scratch Note: Please don't mention PenguinMod nor Permafy on Scratch, we have different rules compared to Scratch! 😅"
            key="home.scratchnote"
        />
    </p>

    <!-- Category sections -->
    <div class="section-categories">
        <!-- feeds -->
        <div class="section-categories-feeds">
            {#if StateApplication.loggedInProcessed && $StoreSettings.loggedIn}
                <div class="section-categories-feeds-login">
                    <div class="section-categories-feeds-login-left">
                        <!-- user profile header -->
                        <div class="section-categories-feeds-login-left-username">
                            <a href={`/profile/${$StoreSession.userCachedUsername}`}>
                                <img
                                    src={PenguinModClient.users.getPfpUrl($StoreSession.userCachedUsername)}
                                    alt={$StoreSession.userCachedDisplayName}
                                    title={$StoreSession.userCachedDisplayName}
                                />
                                <div>
                                    <h1>
                                        <LocalizedString
                                            text="Hello, $1!"
                                            key="home.welcome"
                                            replacers={{
                                                "$1": $StoreSession.userCachedDisplayName,
                                            }}
                                        />
                                    </h1>
                                    <!-- TODO: Replace this with a welcome translation -->
                                    <p>
                                        <LocalizedString
                                            text="My Account"
                                            key="account.title"
                                        />
                                    </p>
                                </div>
                            </a>
                        </div>
                        <!-- profile actions -->
                        <div class="section-categories-feeds-login-left-actions">
                            <!-- Create Button -->
                            <a
                                title="Create"
                                href={addPenguinModUserId(externalLinks.editor, $StoreSettings.loggedIn ? $StoreSession.userCachedId : "")}
                                target="_blank"
                                rel="noopener noreferrer"
                                {@attach LocalizedTooltip("navigation.create")}
                            >
                                <button
                                    title="Create"
                                    {@attach LocalizedTooltip("navigation.create")}
                                >
                                    <div></div>
                                    <span>
                                        <Icon filled={true}>design_services</Icon>
                                        <LocalizedString
                                            text="Create"
                                            key="navigation.create"
                                        />
                                    </span>
                                </button>
                            </a>
                            <!-- My Stuff Button -->
                            <a
                                title="My Stuff"
                                href={`${base}/mystuff`}
                                {@attach LocalizedTooltip("mystuff.title")}
                            >
                                <button
                                    title="My Stuff"
                                    {@attach LocalizedTooltip("mystuff.title")}
                                >
                                    <div></div>
                                    <span>
                                        <Icon filled={true}>folder</Icon>
                                        <LocalizedString
                                            text="My Stuff"
                                            key="mystuff.title"
                                        />
                                    </span>
                                </button>
                            </a>
                            <!-- Settings Button -->
                            <a
                                title="Settings"
                                href={`${base}/settings`}
                                {@attach LocalizedTooltip("account.settings.title")}
                            >
                                <button
                                    title="Settings"
                                    {@attach LocalizedTooltip("account.settings.title")}
                                >
                                    <div></div>
                                    <span>
                                        <Icon filled={true}>settings</Icon>
                                        <LocalizedString
                                            text="Settings"
                                            key="account.settings.title"
                                        />
                                    </span>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="section-categories-feeds-login-right">
                        <SwappableHolder>
                            {#snippet holderWhatsNew()}
                                <div class="section-categories-feeds-login-right-container">
                                    <WhatsNew />
                                </div>
                            {/snippet}
                            {#snippet holderPenguinNews()}
                                <div class="section-categories-feeds-login-right-container">
                                    <PenguinNews />
                                </div>
                            {/snippet}
                            {#snippet holderMyFeed()}
                                <div class="section-categories-feeds-login-right-container">
                                    <MyFeed />
                                </div>
                            {/snippet}
                            {#snippet swapWhatsNew()}
                                <LocalizedString
                                    text="What's new?"
                                    key="home.sections.whatsnew"
                                />
                            {/snippet}
                            {#snippet swapPenguinNews()}
                                <LocalizedString
                                    text="PenguinNews"
                                    key="home.sections.informational"
                                />
                            {/snippet}
                            {#snippet swapMyFeed()}
                                <LocalizedString
                                    text="My Feed"
                                    key="home.sections.feed"
                                />
                            {/snippet}
                        </SwappableHolder>
                    </div>
                </div>
            {:else if !StateApplication.loggedInProcessed || !($StoreSettings.loggedIn)}
                <div class="section-categories-feeds-logout">
                    <div class="section-categories-feeds-logout-left">
                        <WhatsNew />
                    </div>
                    <div class="section-categories-feeds-logout-right">
                        <PenguinNews />
                    </div>
                </div>
            {/if}
        </div>

        <!-- front page projects -->
        <div class="section-categories-projects">
            <!-- snippet for each section to reuse -->
            {#snippet projectRow(section)}
                {#if frontPageLoading}
                    <div class="section-categories-projects-rowtext">
                        <LoadingSpinner />
                    </div>
                {:else if frontPageError}
                    <div
                        class="section-categories-projects-rowtext"
                        style={frontPageRatelimited ? "" : "color:red"}
                    >
                        {#if frontPageRatelimited}
                            <img
                                src={`${base}/asset/penguin/wait.svg`}
                                alt="Please wait before trying to access this page again."
                                {@attach LocalizedAlt("navigation.error.429")}
                            />
                            <p>
                                <LocalizedString
                                    text="Please wait before trying to access this page again."
                                    key="navigation.error.429"
                                />
                            </p>
                        {:else}
                            <img
                                src={`${base}/asset/penguin/server.svg`}
                                alt="Whoops! Our server's having some problems. Try again later."
                                {@attach LocalizedAlt("home.server.error")}
                            />
                            <p>
                                <LocalizedString
                                    text="Whoops! Our server's having some problems. Try again later."
                                    key="home.server.error"
                                />
                            </p>
                        {/if}
                    </div>
                {:else if $StoreSession.frontpageProjectsCachedResult[section].length <= 0}
                    <div class="section-categories-projects-rowtext">
                        <img
                            src={`${base}/asset/penguin/drawing.svg`}
                            alt="No projects found. Why not upload one?"
                            height="80px"
                            {@attach LocalizedAlt("mystuff.none")}
                        />
                        <p>
                            <LocalizedString
                                text="No projects found. Why not upload one?"
                                key="mystuff.none"
                            />
                        </p>
                    </div>
                {:else}
                    <div class="section-categories-projects-row">
                        {#each $StoreSession.frontpageProjectsCachedResult[section] as project}
                            <!-- TODO: User display should allow 3 hrefs for the user pfp & bottom text -->
                            <!-- TODO: Project needs some way to display fromDonator -->
                            <Project
                                src={PenguinModClient.projects.getProjectThumbnailURL(project.id)}
                                userSrc={PenguinModClient.users.getPfpUrl(project.author.username)}
                                href={addPenguinModUserId(`${PUBLIC_STUDIO_URL}/#${project.id}`, $StoreSettings.loggedIn ? $StoreSession.userCachedId : "")}
                                glint={project.featured ? "featured" : null}
                                title={project.title}
                            >
                                {#snippet textTop()}
                                    <!-- TODO: This should be rendered with inline untrusted markdown -->
                                    {project.title}
                                {/snippet}
                                {#snippet textBottom()}
                                    {project.author.username}
                                {/snippet}
                            </Project>
                        {/each}
                    </div>
                {/if}
            {/snippet}

            <!-- Latest featured projects -->
            <Category>
                {#snippet header()}
                    <LocalizedString
                        text="Latest featured projects"
                        key="home.sections.weeklyfeatured"
                    />
                {/snippet}
                {@render projectRow("featured")}
            </Category>
            <!-- Projects people want Featured -->
            <Category>
                {#snippet header()}
                    <LocalizedString
                        text="Projects people want Featured"
                        key="home.sections.mostvoted"
                    />
                {/snippet}
                {@render projectRow("voted")}
            </Category>
            {#if
                frontPageLoading || frontPageError
                || !($StoreSession.frontpageProjectsCachedResult.selectedTag)
                || !($StoreSession.frontpageProjectsCachedResult.tagged)
                || ($StoreSession.frontpageProjectsCachedResult.tagged).length <= 0
            }
                <!-- nada dont display the # section -->
            {:else}
                <!-- Projects marked as # -->
                <Category>
                    {#snippet header()}
                        <LocalizedString
                            text="Projects marked as #$1"
                            key="home.sections.sortedbytag"
                            replacers={{
                                "$1": ($StoreSession.frontpageProjectsCachedResult.selectedTag).replace("#", ""),
                            }}
                        />
                    {/snippet}
                    {@render projectRow("tagged")}
                </Category>
            {/if}
            <!-- Latest projects -->
            <Category>
                {#snippet header()}
                    <LocalizedString
                        text="Latest projects"
                        key="home.sections.todaysprojects"
                    />
                {/snippet}
                {@render projectRow("latest")}
            </Category>
        </div>
    </div>

    <!-- footer -->
    <div class="section-footer">
        <p style="margin-block-end: 2px;">
            <LocalizedString
                text="PenguinMod is not affiliated with Scratch, TurboWarp, the Scratch Team, or the Scratch Foundation."
                key="home.footer.notaffiliated"
            />
        </p>
        <!-- TODO: UNIMPORTANT: Markdown -->
        <p style="margin-block-start: 2px;">
            <LocalizedString
                text={"Scratch is a project of the Scratch Foundation. It is available for free at {{LINK}}."}
                key="home.footer.notaffiliated2"
                replacers={{
                    "{{LINK}}": "https://scratch.org/",
                }}
            />
        </p>

        <div class="section-footer-list">
            <div class="section-footer-list-item">
                <p>
                    <LocalizedString
                        text="Website"
                        key="home.footer.sections.website"
                    />
                </p>
                <a href={addPenguinModUserId(externalLinks.editor, $StoreSettings.loggedIn ? $StoreSession.userCachedId : "")} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Editor"
                        key="home.footer.sections.website.editor"
                    />
                </a>
                <a href={externalLinks.credits} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Credits"
                        key="home.footer.sections.website.credits"
                    />
                </a>
                <a href={externalLinks.github} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Source"
                        key="home.footer.sections.website.source"
                    />
                </a>
                <a href={externalLinks.packager} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Packager"
                        key="home.footer.sections.website.packager"
                    />
                </a>
            </div>
            <div class="section-footer-list-item">
                <p>
                    <LocalizedString
                        text="Community"
                        key="home.footer.sections.community"
                    />
                </p>
                <a href={externalLinks.issues} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Report an issue"
                        key="home.footer.sections.info.reportissue"
                    />
                </a>
                <a href={externalLinks.wiki} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Community Wiki"
                        key="home.footer.sections.community.wiki"
                    />
                </a>
                <a href={externalLinks.discord} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Join our Discord!"
                        key="navigation.discord"
                    />
                </a>
            </div>
            <div class="section-footer-list-item">
                <p>
                    <LocalizedString
                        text="Info"
                        key="home.footer.sections.info"
                    />
                </p>
                <a href={`${base}/terms`}>
                    <LocalizedString
                        text="Terms of Service"
                        key="home.footer.sections.info.terms"
                    />
                </a>
                <a href={`${base}/privacy`}>
                    <LocalizedString
                        text="Privacy Policy"
                        key="home.footer.sections.info.privacy"
                    />
                </a>
                <a href={`${base}/guidelines/uploading`}>
                    <LocalizedString
                        text="Uploading Guidelines"
                        key="home.footer.sections.info.guidelines"
                    />
                </a>
                <a href={externalLinks.contact} target="_blank" rel="noopener noreferrer">
                    <LocalizedString
                        text="Contact Us"
                        key="home.footer.sections.info.contact"
                    />
                </a>
            </div>
            <div class="section-footer-list-item">
                <p>
                    <LocalizedString
                        text="Funding"
                        key="home.footer.sections.donate"
                    />
                </p>
                <a href={`${base}/support`}>
                    PenguinMod
                </a>
                <a href={externalLinks.scratch} target="_blank" rel="noopener noreferrer">
                    Scratch
                </a>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .section-onboarding {
        width: 100%;
        height: 24rem;

        display: flex;
        flex-direction: row;

        background: #8cafffad;
        color: white;
    }
    .section-onboarding-studio,
    .section-onboarding-showoff {
        width: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    .section-onboarding-studio-inner,
    .section-onboarding-showoff-inner {
        width: 80%;
        height: 80%;
    }
    .section-onboarding-studio-inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        overflow-wrap: break-word;
        font-weight: bold;
        font-size: 2em;
    }
    .section-onboarding-studio-inner p {
        margin-block: 16px;
    }
    .section-onboarding-showoff-inner {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .section-onboarding-showoff-inner-video {
        border-radius: 8px;
        outline-width: 6px;
        outline-style: solid;
        outline-color: rgba(255, 255, 255, 0.35);
    }

    .section-language-warning {
        width: calc(100% - 10%);
        padding: 0 5%;
        margin: 0px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #ffd00073;
        color: black;
        overflow-wrap: break-word;

        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }
    :global(body.app-theme-dark) .section-language-warning,
    :global(body.app-theme-amoled) .section-language-warning {
        color: white;
    }

    .section-scratchnote {
        width: 100%;
        margin-block-end: 0.35em;

        text-align: center;
        font-weight: bold;
        font-style: italic;
    }

    .section-categories {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .section-categories-feeds {
        width: 75%;
        max-width: 1500px;
    }
    .section-categories-feeds-login,
    .section-categories-feeds-logout {
        width: 100%;

        display: flex;
        flex-direction: row;
    }
    .section-categories-feeds-login {
        align-items: center;
    }
    .section-categories-feeds-login-left,
    .section-categories-feeds-logout-left,
    .section-categories-feeds-login-right,
    .section-categories-feeds-logout-right {
        width: 50%;
    }
    .section-categories-feeds-login-right-container,
    .section-categories-feeds-login-right :global(*[data-penguinmodsvelteui-swappableholder-header="true"]) {
        width: 100%;
    }

    .section-categories-feeds-login-left {
        /* we kinda just have to assume this is a good height... */
        height: 360px;

        display: flex;
        flex-direction: column;
    }
    .section-categories-feeds-login-left > div {
        width: 100%;
    }

    .section-categories-feeds-login-left-username > a {
        width: 100%;
        height: 6em;

        display: flex;
        flex-direction: row;
        align-items: center;

        color: inherit;
        text-decoration: none;
    }
    .section-categories-feeds-login-left-username > a img {
        width: 6em;
        height: 6em;
        margin-inline-end: 8px;

        border-radius: 16px;
        /* bouba kiki is stupid annoying marketing but it kinda works here so */
        corner-shape: squircle;
    }
    .section-categories-feeds-login-left-username > a > div {
        width: calc(100% - (6em + 8px));
    }
    .section-categories-feeds-login-left-username > a > div h1,
    .section-categories-feeds-login-left-username > a > div p {
        width: 100%;
        margin-block: 4px;
    }
    .section-categories-feeds-login-left-username > a > div h1 {
        height: 1.3em;

        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .section-categories-feeds-login-left-username > a > div p {
        width: 100%;
        max-height: calc(6em - (2em + 4px + 4px + 4px));

        font-style: italic;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .section-categories-feeds-login-left-actions {
        width: 100%;
        height: calc(100% - 6em);
        margin-top: 8px;
    }
    .section-categories-feeds-login-left-actions > a {
        display: block;
        width: 100%;
        height: calc(100% / 3);

        color: inherit;
        text-decoration: none;
    }
    .section-categories-feeds-login-left-actions > a > button {
        position: relative;
        width: 100%;
        height: calc(100% - 1px);
        border: 0;

        display: flex;
        flex-direction: row;
        align-items: center;

        color: inherit;
        background: transparent;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        font-weight: bold;
        font-size: 2em;

        cursor: pointer;
    }
    .section-categories-feeds-login-left-actions > a > button > span {
        display: flex;
        align-items: center;
    }
    .section-categories-feeds-login-left-actions > a > button > span > :global(span) {
        font-size: 1.5em;
        margin: 0 8px;
    }
    .section-categories-feeds-login-left-actions > a:last-child > button {
        border-bottom: initial;
    }
    :global(body.app-theme-dark) .section-categories-feeds-login-left-actions > a > button {
        border-bottom-color: rgba(255, 255, 255, .1);
    }
    :global(body.app-theme-amoled) .section-categories-feeds-login-left-actions > a > button {
        border-bottom-color: rgba(255, 255, 255, 1);
    }
    .section-categories-feeds-login-left-actions > a > button > * {
        z-index: 5;
    }
    .section-categories-feeds-login-left-actions > a > button:hover {
        color: white;
    }
    .section-categories-feeds-login-left-actions > a > button > div {
        position: absolute;
        left: 0;
        top: 0;
        width: 0%;
        height: 100%;

        outline: 0;
        border-radius: 8px;

        transition: 0.2s ease-in-out;
        transition-property: width outline-width;
        z-index: 0;
    }
    :global(html[dir="rtl"]) .section-categories-feeds-login-left-actions > a > button > div {
        left: initial;
        right: 0;
    }
    .section-categories-feeds-login-left-actions > a > button:hover > div {
        width: 100%;
        outline-style: solid;
        outline-width: 4px;

        transition: 0.1s ease-out;
        transition-property: width outline-width;
    }

    .section-categories-feeds-login-left-actions > a:nth-child(1) > button > div {
        background: #8cafff;
        outline-color: #8cafff55;
    }
    .section-categories-feeds-login-left-actions > a:nth-child(2) > button > div {
        background: #FFAB00;
        outline-color: #FFAB0055;
    }
    .section-categories-feeds-login-left-actions > a:nth-child(3) > button > div {
        background: #808080;
        outline-color: #80808055;
    }
    .section-categories-feeds-login-left-actions > a > button:active > div {
        filter: brightness(0.9);
        transform: scaleY(0.9);
    }
    :global(body.app-theme-dark) .section-categories-feeds-login-left-actions > a > button > div {
        opacity: 0.75;
    }

    .section-categories-projects {
        width: 75%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .section-categories-projects :global(div[data-penguinmodsvelteui-category="true"]) {
        /* allow for the project list to fill the size so the scrollbar can appear if needed */
        /* min height is so the sections arent *too* small (especiially cuz the loading spinner) */
        /* the max height is so the svgs or error displays & such dont fill the whole screenn */
        /*
         * to calc min-height:
         *
         * the height of a project
         * + category header height + category header border + category text margins
         * + category container margin + category text size
         */
        height: unset;
        min-height: calc((152px + 4px + 40px + ((8px + 1px) * 2))
            + 0.35rem + 1px + 12px
            + 6px + 18px);
        max-height: 320px;
    }
    .section-categories-projects-row {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;

        overflow: hidden;
        overflow-x: auto;
    }
    .section-categories-projects-rowtext {
        width: 100%;
        height: 200px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .section-footer {
        width: 100%;
        margin-top: 4px;
        padding: 24px 0 48px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-top: rgba(0, 0, 0, .3) 1px solid;
        background: #8cafff15;
        font-weight: 700;
    }
    .section-footer-list {
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }
    .section-footer-list-item {
        margin: 0 32px;

        display: flex;
        flex-direction: column;

        font-size: 14px;
    }
    .section-footer-list-item a {
        margin: 2px 0;

        font-weight: normal;
    }
</style>
