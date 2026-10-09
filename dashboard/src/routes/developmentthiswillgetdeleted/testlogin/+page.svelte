<script>
    import Authenticator from "$lib/resources/penguinmod/authentication/authenticator";

    // components
    import Icon from "$lib/components/Icon/Component.svelte";
    import EnterSubmit from "$lib/components/EnterSubmit.svelte.js";
    
    import StoreSettings from "$lib/stores/settings.js";
    import StoreSession from "$lib/stores/session.js";

    let token = $state("");
    let loggingIn = $state(false);
    let loggingOut = $state(false);
    const tokenLogin = async () => {
        if (loggingIn) return;

        loggingIn = true;
        try {
            await Authenticator.loginToken(token);
        } finally {
            loggingIn = false;
        }
    };

    const logout = async () => {
        if (loggingIn) return;

        loggingOut = true;
        try {
            await Authenticator.logout();
        } finally {
            loggingOut = false;
        }
    };
</script>

{#snippet warning()}
    <p class="warning"><b><i><em>
        <Icon style="font-size:64px">no_encryption</Icon>
        <br />
        THIS IS AN UNFINISHED, IMPROPER LOGIN PAGE!!!
        <br />
        DO NOT SHARE YOUR PENGUINMOD ACCOUNT TOKEN WITH ANYONE!!!
        <br />
        PenguinMod will NEVER ask for your account token directly
        on the final site.
    </em></i></b></p>
{/snippet}

<h1>Login</h1>
{@render warning()}
<div class="center">
    <p>Token</p>
    <input
        type="password"
        bind:value={token}
        onsubmit={() => tokenLogin()}
        {@attach EnterSubmit()}
    />
    <button onclick={tokenLogin}>
        {loggingIn ? "Loggingin" : "Go"}
    </button>
    
    {#if $StoreSettings.loggedIn}
        <h1>Logged in</h1>
        <p>{$StoreSession.userCachedDisplayName}</p>
        <button onclick={logout}>Logout</button>
    {/if}
</div>
{@render warning()}

<style>
    .warning {
        width: 100%;
        padding: 32px 0;

        font-size: 32px;
        text-align: center;
        background: red;
        color: white;

        animation: warning-blink 1s linear 0s infinite forwards;
    }
    @keyframes warning-blink {
        0% { background-color: red; }
        50% { background-color: darkred; }
        100% { background-color: red; }
    }

    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>