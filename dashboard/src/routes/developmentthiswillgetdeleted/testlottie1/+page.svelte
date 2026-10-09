<script>
    import { base } from "$app/paths";

    // components
    import { Lottie } from "PenguinMod-SvelteUI";
    import Icon from "$lib/components/Icon/Component.svelte";
</script>

<h1>Lottie</h1>

<h3>hoverdevice</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/hoverdevice.json"}</b></span>
    <span>vs.</span>
    <span><b>{"/asset/penguin/animated/svg/hoverdevice.svg"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/hoverdevice.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
    <div class="card">
        <img
            src={`${base}/asset/penguin/animated/svg/hoverdevice.svg`}
            alt="Penguin"
        />
    </div>
</div>
<h3>test</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/test.json"}</b></span>
    <span>vs.</span>
    <span><b>{"/asset/penguin/animated/svg/test.svg"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/test.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
    <div class="card">
        <img
            src={`${base}/asset/penguin/animated/svg/test.svg`}
            alt="Penguin"
        />
    </div>
</div>
<h3>engineerserver</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/engineerserver.json"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/engineerserver.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
</div>
<h3>party</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/party.json"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/party.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
</div>
<h3>drawingthinking</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/drawingthinking.json"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/drawingthinking.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
</div>
<h3>splashbucket</h3>
<p>
    <span><b>{"/asset/penguin/animated/lottie/splashbucket.json"}</b></span>
</p>
<div class="row">
    <div class="card">
        <Lottie
            src={`${base}/asset/penguin/animated/lottie/splashbucket.json`}
            autoplay
        >
            <div class="card-lottie-placeholder">
                <Icon style="font-size:48px;">downloading</Icon>
            </div>
        </Lottie>
    </div>
</div>

<style>
    .row {
        width: 100%;
        height: 480px;

        display: flex;
        flex-direction: row;
    }
    .card {
        width: 480px;
        height: 480px;
    }
    
    .card :global(div[data-penguinmodsvelteui-lottie-placeholder="true"]) {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .card-lottie-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .card :global(div[data-penguinmodsvelteui-lottie="true"]),
    .card img {
        width: 100%;
        height: 100%;
    }
    .card img {
        object-fit: contain;
    }
</style>