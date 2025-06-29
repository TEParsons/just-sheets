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


</script>

<Ribbon></Ribbon>
<Notebook>
    <NotebookPage>
        <Table name="Sheet 1"></Table>
    </NotebookPage>
</Notebook>