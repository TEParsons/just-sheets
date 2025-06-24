<script>
    import { getContext, onMount } from "svelte";
    import { get, writable } from "svelte/store";

    let renaming = writable(false);
    let renameCtrl = writable(undefined);
    renameCtrl.subscribe((value) => {
        if (value) {
            value.focus()
        }
    })
    export let title = writable("Sheet");

    let current = getContext("current");
    let siblings = getContext("pages");
    let tab;
    let page;

    onMount(() => {
        siblings.update((value) => {
            value.push(tab);

            return value
        })
        if (get(current) === undefined) {
            current.set(tab)
        }
    })
</script>

<div
    class=notebook-page
    bind:this={page}
    style:display={$current === tab ? "block" : "none"}
>
    <slot></slot>
</div>

<button 
    bind:this={tab}
    class:active={$current === tab}
    class=notebook-tab
    on:click={(evt) => current.set(tab)}
    on:dblclick={(evt) => {
        renaming.set(true);
    }}
>
    {#if $renaming}
    <input
        class=rename-ctrl
        bind:this={$renameCtrl}
        bind:value={$title}
        hidden={!renaming}
        on:focusout={(evt) => renaming.set(false)}
        on:keypress={(evt) => {
            if (evt.key == "Enter") {
                renaming.set(false)
            }
        }}
    >
    {:else}
    <span>
        {$title}
    </span>
    {/if}
</button>

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
        grid-column-end: var(--npages);
        border-bottom: 1px solid var(--overlay);
        padding: 1rem;
        background-color: var(--base);
        overflow: auto;
    }
    .rename-ctrl {
        border: none;
        outline: none;
        color: inherit;
        background-color: transparent;
        padding: 0;
        margin: -.5rem 0;
    }
</style>