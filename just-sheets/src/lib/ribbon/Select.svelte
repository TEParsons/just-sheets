<script>
export let label;
let ctrl;
</script>

<div
    class=select
>
    {#if label}
    <span
        class=select-label
    >
        {label}
    </span>
    {/if}
    <select
        class=select-ctrl
        bind:this={ctrl}
        on:change
    >
        <slot></slot>
    </select>
</div>

<style>
    .select {
        display: grid;
        grid-template-rows: min-content min-content;
        gap: .25rem;
        padding: .5rem;
    }
    .select-label {
        color: lightgrey;
    }
    .select:hover .select-label {
        color: black;
    }
    .select-ctrl {

    }
</style>