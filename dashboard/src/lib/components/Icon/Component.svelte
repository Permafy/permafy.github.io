<script>
    let props = $props();
</script>

<span
    {...props}
    class={`material-symbols-outlined${props.filled ? " material-symbols-filled" : ""}`}
>
    {@render props.children?.()}
</span>

<style>
    .material-symbols-outlined {
        user-select: none;
    }
    .material-symbols-filled {
        font-variation-settings: 'FILL' 1;
    }
</style>