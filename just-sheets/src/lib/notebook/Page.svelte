<script>
    import { getContext, onMount } from "svelte";

    let {
        title="",
        children
    } = $props()

    let siblings = getContext("pages");
    let index = $state(siblings.count);
    siblings.count += 1;
    let renaming = $state(false);
</script>

<button 
    class=notebook-tab
    class:active={siblings.current === index}
    onclick={(evt) => siblings.current = index}
    ondblclick={(evt) => renaming = true}
>
    {#if renaming}
    <input
        class=rename-ctrl
        bind:value={title}
        hidden={!renaming}
        onfocusout={(evt) => renaming = false}
        onkeypress={(evt) => {
            if (evt.key === "Enter") {
                renaming = false
            }
        }}
    >
    {:else}
    <span>
        {title}
    </span>
    {/if}
</button>
{#if siblings.current === index}
<div 
    class=notebook-page
    style:grid-column-end="span {siblings.count + 1}"
>
    {@render children()}
</div>
{/if}

<style>
    .notebook-tab {
        grid-row-start: tabs;
        background-color: var(--base);
        border: 1px solid var(--overlay);
        border-radius: 1.5em;
        height: 3em;
        padding: 1em;
        line-height: 1em;
        margin-bottom: 1rem;
    }
    .notebook-tab:first-of-type {
        margin-left: 1em;
    }
    .notebook-tab.active  {
        color: var(--base);
        background-color: var(--blue);
        
    }
    .notebook-tab:hover {
        border-color: var(--blue);
    }
    .notebook-page {
        position: relative;
        grid-row-start: page;
        grid-column-start: 1;
        border-bottom: 1px solid var(--overlay);
        padding: 1rem;
        background-color: var(--base);
        overflow: auto;
        justify-self: stretch;
    }
    .rename-ctrl {
        border: none;
        outline: none;
        color: inherit;
        background-color: transparent;
        padding: 0;
        margin: 0;
    }
</style>