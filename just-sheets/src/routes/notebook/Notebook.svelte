<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    let pages = writable([])

    setContext("pages", pages)
    setContext("current", writable(undefined))
</script>

<div
    class=notebook
    style:--npages={$pages.length + 2}
>
    <slot></slot>
</div>

<style>
    .notebook {
        display: grid;
        height: 100vh;
        max-height: 100vh;
        max-width: 100vw;
        grid-template-rows: [page] 1fr [tabs] min-content;
        gap: 1rem .5rem;
        box-sizing: border-box;
        background-color: var(--crust);
    }
</style>
