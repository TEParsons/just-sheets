<script>
    import { setContext } from "svelte";
    import { Notebook, NotebookPage } from "$lib/notebook";
    import Table from "./Table.svelte";
    import { HyperFormula } from 'hyperformula';
    import Ribbon from "./ribbon/Ribbon.svelte";

    // set up formulas engine
    let formulas = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    setContext("formulas", formulas)
    // stores the currently selected cells
    let selection = $state({
        selected: [],
        focus: {
            handle: undefined,
            row: undefined,
            col: undefined
        }
    })
    setContext("selection", selection)

    import { Document } from "$lib/document";
    let doc = $state(new Document())
    setContext("document", doc)


</script>
<div class=workbook>
    <Ribbon></Ribbon>
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

<style>
    .workbook {
        display: grid;
        grid-template-columns: [start] 1fr [end];
        grid-template-rows: [ribbon] auto 1fr;
        height: 100vh;
    }
</style>