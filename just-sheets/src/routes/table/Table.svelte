<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Grid from "./Grid.svelte";
    import Entry from "./Entry.svelte";
    import { Ribbon } from "./ribbon";

    export let rows = 16;
    export let cols = 8;

    let selection = writable([])
    setContext("selection", selection)
    let focus = writable(null)
    setContext("focus", focus)
    let entry;

    selection.subscribe((value) => {
        if (!value.includes($focus)) {
            // if selection doesn't cover the current focus, move focus to start of selection
            focus.set(value[0])
        } else {
            // if it does, refocus to redirect to the entry again
            focus.set($focus)
        }
    })
    focus.subscribe((value) => {
        if (value && !$selection.includes(value)) {
            // if selection doesn't cover the current focus, reselect
            selection.set([value])
        }
        // pass actual focus to the entry
        if (entry) {
            entry.disabled = false;
            entry.focus()
        }
    })

    let showRibbon = writable(true);
</script>

<div 
    class=table
>
    <div 
        class=table-ctrls
    >
        <Ribbon
            bind:shown={showRibbon}
        ></Ribbon>
        <Entry
            bind:handle={entry}
        ></Entry>
        <input type="checkbox" bind:checked={$showRibbon}>
    </div>
    <Grid
        initialRows={rows}
        initialCols={cols}
    ></Grid>
</div>

<style>
    .table-ctrls {
        display: grid;
        grid-template-columns: [start] 1fr min-content [end];
        grid-template-rows: [ribbon] 1fr [entry] min-content [end];
        gap: 1rem;
        padding: 1rem;
    }
</style>