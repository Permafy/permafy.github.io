<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    // components
    import LocalizedAlt from "./Localization/LocalizedAlt.svelte";
    import LocalizedTooltip from "./Localization/LocalizedTooltip.svelte";
    
    import delay from "$lib/resources/delay.js";

    import StoreSettings from "$lib/stores/settings";
    
    let props = $props();

    // TODO: I do not want to have the same Tips.json structure as legacy home, so this is just a placeholder. What I *really* want is to figure out how to structure a list of tips that can be translated. Translators really wanna make tips too.
    const tips = [
        "This is a tip.",
        "This is also a tip.",
        "Did you know this list of tips is going to be replaced?",
        "Fun fact: This is a tip.",
        "Fun fact: You are waiting for something to load.",
        "Good job ianyourgod",
        "Good job jwklong",
        "Good job JeremyGamer13",
        "Good job godslayerakp",
    ];

    /** @type {HTMLSpanElement} */
    // svelte-ignore non_reactive_update
    let tipsSpan = null;
    let tipsLast = null;
    let tipsText = $state("");
    let tipsMounted = $state(true);
    const tipsEnabled = $derived(props.tips !== false);
    const tipsSwap = async () => {
        if (!browser) return;
        if (!tipsMounted) return;
        if (!tipsEnabled) return;
        if (!tipsSpan) return;

        // we fade out, swap tip, then fade in
        console.log("changing tips"); // TODO: Temp
        if (tipsSpan.dataset.swapped === "true") {
            tipsSpan.animate([{ opacity: "0" }], { duration: 1000, fill: "forwards" });
            await delay(1000);
        }
        
        // swap tip
        const possibleTips = tips.filter(value => value !== tipsLast);
        tipsText = possibleTips[Math.floor(Math.random() * possibleTips.length)];
        tipsSpan.dataset.swapped = true;

        // fade in
        tipsSpan.animate([{ opacity: "1" }], { duration: 1000, fill: "forwards" });
    };
    const tipsLoop = async () => {
        // NOTE: wait a second so we dont show a tip if there's no reason to
        await delay(1000);

        // swap tips every 7 seconds
        tipsSwap();
        const interval = setInterval(() => {
            if (!tipsMounted) clearInterval(interval);
            tipsSwap();
        }, 7000);
    };
    onMount(() => {
        if (!tipsEnabled) return;
        tipsLoop();
        return () => {
            tipsMounted = false;
        };
    });
</script>

<div class="loading">
    <img
        src={$StoreSettings.appTheme === "light" ? `${base}/asset/icons/loading-blue.svg`
            : ($StoreSettings.appTheme === "contrast" ? `${base}/asset/icons/loading-black.svg` : `${base}/asset/icons/loading-white.svg`)}
        alt="Loading"
        {@attach LocalizedAlt("generic.loading")}
        {@attach LocalizedTooltip("generic.loading")}
    />
    {#if tipsEnabled}
        <span
            style="opacity:0"
            data-swapped={false}
            bind:this={tipsSpan}
        >
            {tipsText}
        </span>
    {/if}
</div>

<style>
    .loading {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .loading img {
        animation-name: loading;
        animation-delay: 0s;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;

        user-select: none;
    }
    .loading span {
        margin-top: 8px;

        user-select: none;
    }
    
    @keyframes loading {
        0% { transform: rotate(0deg);  }
        50% { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
    }
</style>
