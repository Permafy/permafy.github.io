<script>
    import { base } from "$app/paths";
</script>

<svelte:head>
    <title>Uploading Guidelines</title>
</svelte:head>

<main>
    <section class="page-shell">
        <h1>Uploading Guidelines</h1>
        <p>This placeholder page exists to prevent broken links in the static GitHub Pages deployment.</p>
        <p>Please replace this content with the final uploading policy when ready.</p>
        <a href={base || "/"}>Go back home</a>
    </section>
</main>

<style>
    main {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #0a0f1a;
        color: white;
        font-family: sans-serif;
    }
    .page-shell {
        max-width: 48rem;
        padding: 2rem;
        line-height: 1.6;
    }
    a {
        color: #7ad7ff;
    }
</style>
