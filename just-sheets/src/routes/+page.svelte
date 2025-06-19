<script>
    import { setContext } from "svelte";
    import { Notebook, NotebookPage } from "./notebook";
    import { Table } from "./table";
    import { HyperFormula } from 'hyperformula';

    // set up formulas engine
    let formulas = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    setContext("formulas", formulas)

</script>



<Notebook>
    <NotebookPage>
        <Table></Table>
    </NotebookPage>
    <NotebookPage>
        <Table></Table>
    </NotebookPage>
</Notebook>



<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');
    
    :global(*) {
        font-family: Noto Sans;
        font-size: 1rem;
    }
    :global(:root) {
        font-size: 10pt;
    }
</style>