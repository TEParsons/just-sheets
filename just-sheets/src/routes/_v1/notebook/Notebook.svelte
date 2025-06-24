<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { HyperFormula } from "hyperformula";
    
    let pages = writable([]);
    setContext("pages", pages);
    let current = writable(undefined);
    setContext("current", current);
    let formulas = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
    setContext("formulas", formulas);
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
