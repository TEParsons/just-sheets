<script>
    let {
        /** @interface */
        children
    } = $props()
</script>

<div
    class=ribbon
>
    {@render children?.()}
</div>

<style>
    .ribbon {
        grid-row-start: ribbon;
        grid-column-start: start;
        grid-column-end: end;

        display: grid;
        grid-auto-flow: column;

        padding: .5rem;
        background-color: var(--mantle);
        border-bottom: 1px solid var(--overlay);
        outline: none;
    }
</style>