<script>
</script>

<div
    class=ribbon
>
    <slot></slot>
</div>

<style>
    .ribbon {
        grid-row-start: ribbon;
        grid-column-start: start;
        grid-column-end: end;

        display: grid;
        grid-auto-flow: row;

        padding: 0.5rem;
        background-color: var(--mantle);
        border: 1px solid var(--overlay);
        outline: none;
        border-radius: .5rem;
    }
</style>