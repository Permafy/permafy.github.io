<script>
    import { browser } from "$app/environment";
    
    // components
    import { Lottie } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
    
    import StateApplication from "$lib/state/app.svelte";
    import StoreSettings from "$lib/stores/settings.js";

    /** @type {HTMLDivElement} */
    let indicatorElement = $state(null);

    let fadeAnimationId = 0;
    let fadeAnimationTimeout = null;
    /** @param {import("lottie-web").AnimationItem} animation */
    const fadeAnimation = (animation) => {
        if (!indicatorElement) return;
        fadeAnimationId++;
        let myFadeAnimationId = fadeAnimationId;

        // NOTE: This is kinda dumb but this resets us back to 1 even if we get interrupted
        indicatorElement.animate([
            { opacity: "1" },
        ], {
            duration: 0,
            fill: "forwards"
        });

        // once the animation loads, do thje fadeout (we dont have rframe rate or anuything until load)
        animation.addEventListener("data_ready", () => {
            if (myFadeAnimationId !== fadeAnimationId) return;
            // we fadeout 1 second before the animatiin ends
            const secondsLength = animation.totalFrames / animation.frameRate;
            const oneSecondBefore = Math.max(0, secondsLength - 1);
            
            if (fadeAnimationTimeout) clearTimeout(fadeAnimationTimeout);
            fadeAnimationTimeout = setTimeout(() => {
                if (myFadeAnimationId !== fadeAnimationId) return;
                indicatorElement.animate([
                    { opacity: "1" },
                    { opacity: "0" },
                ], {
                    duration: 1000,
                    fill: "forwards"
                });
            }, oneSecondBefore * 1000);
        });
    };
    $effect(() => {
        if (!indicatorElement) return;
        if (!StateApplication.penguinActionIndicator) return;
        if (!StateApplication.penguinActionIndicatorLottie) return;

        console.log("updating PenguinActionIndicator", StateApplication.penguinActionIndicatorLottie);
    });
</script>

{#if browser && StateApplication.penguinActionIndicator && StateApplication.penguinActionIndicatorLottie}
    <div class="indicator" bind:this={indicatorElement}>
        <Lottie
            src={StateApplication.penguinActionIndicatorLottie}
            style="position:absolute;width:100%;height:100%;bottom:0;right:0;"
            autoplay
            loop={false}
            animationRef={fadeAnimation}
        />
    </div>
{/if}

<style>
    .indicator {
        position: absolute;
        width: 40%;
        height: 40%;
        right: 0;
        bottom: 0;

        overflow: hidden;

        pointer-events: none;
        user-select: none;
        z-index: 500;
    }
    :global(*[data-penguinmodsvelteui-lottie="true"] > svg) {
        position: absolute;
        right: 0;
        width: initial !important;
    }
</style>