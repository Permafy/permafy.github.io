<script>
    import { browser } from "$app/environment";

    // components
    import { Category } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
    import LocalizedString from "$lib/components/Localization/LocalizedString.svelte";
    
    import TranslationMapper from "$lib/resources/localization/translation/mapper";

    import StoreSettings from "$lib/stores/settings";

    let props = $props();
</script>

<Category {...props}>
    <!-- PenguinNews Category -->
    {#snippet header()}
        <LocalizedString
            text="PenguinNews"
            key="home.sections.informational"
        />
    {/snippet}
    {#snippet headerSecondary()}
        <!-- NOTE: Remove target="_blank" if page leads to a pm domain -->
        <a
            href={"https://itch.io/jam/all-the-mods-game-jam"}
            target="_blank"
            rel="noopener noreferrer"
        >
            <LocalizedString
                text="See more"
                key="home.seemore"
            />
            <!-- NOTE: remove this if the page leads to a pm domain -->
            <Icon style="font-size:0.9rem;display:inline">
                open_in_new
            </Icon>
        </a>
    {/snippet}
    <div>
        <h2 style="margin-block:4px;">
            All The Mods Game Jam has ended!
        </h2>
        <div style="width:100%">
            <p>
                Thanks for participating in the event! Rankings will be announced
                on <a href="https://itch.io/jam/all-the-mods-game-jam" target="_blank" rel="noopener noreferrer">itch.io</a>.
                See you soon!
            </p>
            <a href="https://itch.io/jam/all-the-mods-game-jam" target="_blank" rel="noopener noreferrer">
                All The Mods on itch.io
            </a>
        </div>
        <hr />
        <!-- TODO: This should link to the active origin URL, not penguinmod.com -->
        <img
            src="https://penguinmod.com/events/news/allthemods2026.webp?r=1"
            alt="All The Mods 2026"
            style="width:100%;border-radius:8px;"
        />
    </div>
</Category>
