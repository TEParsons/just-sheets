<script>
    import { setContext } from "svelte";
    import { Notebook, NotebookPage } from "$lib/notebook";
    import Table from "./Table.svelte";
    import EntryBox from "./EntryBox.svelte";
    import { HyperFormula } from 'hyperformula';
    import { newDocument, newSheet } from "$lib/document";
    import Ribbon from "./ribbon/Ribbon.svelte";

    // set up formulas engine
    let formulas = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    setContext("formulas", formulas)
    // setup entry box
    let entry;
    // stores current entry mode
    let entryMode = $state()
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
    
    // stores key modifiers
    let modifiers = $state({
        Control: false,
        Command: false,
        Alt: false,
        Shift: false
    })
    setContext("modifiers", modifiers)

    let doc = $state(newDocument("headers"))
    setContext("document", doc)
</script>


<div class=workbook>
    <Ribbon></Ribbon>
    <EntryBox></EntryBox>
    <Notebook
        onnew={(evt) => doc.data[`Sheet ${Object.keys(doc.data).length + 1}`] = newSheet()}
    >
        {#each Object.keys(doc.data) as name}
            <NotebookPage title={name}>
            <Table name={name} initialCells={doc.data[name]}></Table>
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
    
</style>