<script>
    import { setContext } from "svelte";

    let {
        onnew = undefined,
        children
    } = $props()
    let pages = $state({
        current: 0,
        count: 0,
    })
    setContext("pages", pages)
</script>

<div 
    class=notebook
>
    {@render children()}
    {#if onnew}
        <button 
            class=notebook-btn-new
            onclick={onnew}
        >+</button>
    {/if}
</div>

<style>
    .notebook {
        display: grid;
        max-width: 100vw;
        grid-template-rows: [page] 1fr [tabs] min-content;
        gap: 1rem .5rem;
        box-sizing: border-box;
        background-color: var(--crust);
    }

    .notebook-btn-new {
        grid-row-start: tabs;
        background-color: var(--base);
        border: 1px solid var(--overlay);
        border-radius: 1.5em;
        height: 3em;
        padding: 1em;
        line-height: 1em;
        margin-bottom: 1rem;
        justify-self: start;
    }
    .notebook-btn-new:hover {
        border-color: var(--blue);
    }
</style>