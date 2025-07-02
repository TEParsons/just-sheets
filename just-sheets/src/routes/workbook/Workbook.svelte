<script>
    import { setContext } from "svelte";
    import { Notebook, NotebookPage } from "$lib/notebook";
    import Table from "./Table.svelte";
    import { HyperFormula } from 'hyperformula';
    import Ribbon from "./ribbon/Ribbon.svelte";

    // set up formulas engine
    let formulas = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    setContext("formulas", formulas)
    // get handle of entry box
    let entry;
    // stores the currently selected cells
    let selection = $state({
        selected: [],
        focus: {
            handle: undefined,
            row: undefined,
            col: undefined
        },
        tabbing: {
            active: false,
            root: 0
        }
    })
    setContext("selection", selection)
    // if focus moves outside selection...
    $effect(() => {
        if (!selection.selected.includes(selection.focus)) {
            // if pressing control, add focus to selection
            if (modifiers.Control) {
                selection.selected.push(selection.focus);
            } else {
                // otherwise, focus is the new selection
                selection.selected = [selection.focus];
            }
        }
        // focus and reset entry box
        entry.value = selection.focus.data ? selection.focus.data : "";
        entry.focus();
    })
    // stores key modifiers
    let modifiers = $state({
        Control: false,
        Command: false,
        Alt: false,
        Shift: false
    })
    setContext("modifiers", modifiers)

    import { Document } from "$lib/document";
    let doc = $state(new Document())
    setContext("document", doc)
</script>


<div class=workbook>
    <Ribbon></Ribbon>
    <input
        class=entry-box
        bind:this={entry}
        disabled={selection.focus.handle === undefined}
        oninput={(evt) => {
            selection.focus.data = entry.value;
        }}
    >
    <Notebook
        onnew={(evt) => doc.data[`Sheet ${Object.keys(doc.data).length + 1}`] = [[""]]}
    >
        {#each Object.keys(doc.data) as name}
            <NotebookPage title={name}>
            <Table name={name}></Table>
            </NotebookPage>
        {/each}
    </Notebook>
</div>


<svelte:window 
    on:keydown={
        (evt) => {
            // CTRL, CMD, ALT, SHIFT: set modifier mode
            if (evt.key in modifiers) {
                modifiers[evt.key] = true
            }
        }
    }
    on:keyup={
        (evt) => {
            // CTRL, CMD, ALT, SHIFT: leave modifier mode
            if (evt.key in modifiers) {
                modifiers[evt.key] = false
            }
        }
    } 
/>


<style>
    .workbook {
        display: grid;
        grid-template-columns: [start] 1fr [end];
        grid-template-rows: [ribbon] auto [entry] min-content [table] 1fr;
        height: 100vh;
    }

    .entry-box {
        padding: .5rem;
        margin: 1rem;
        width: calc(100% - 2rem);
        box-sizing: border-box;
        border: 1px solid var(--overlay);
        outline: none;
        border-radius: .5rem;
    }
    .entry-box:focus {
        border: 1px solid var(--blue);
    }
</style>