<script>
    import { base } from "$app/paths";
</script>

<svelte:head>
    <title>Settings Site</title>
</svelte:head>

<main>
    <section class="page-shell">
        <h1>Settings Site</h1>
        <p>This page is a placeholder for the site settings area.</p>
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
        text-align: center;
        max-width: 48rem;
        padding: 2rem;
    }
    a {
        color: #7ad7ff;
    }
</style>
