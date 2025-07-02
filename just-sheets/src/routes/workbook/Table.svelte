<script>
    import { getContext, setContext } from "svelte";
    import Cell from "./Cell.svelte";

    let {
        name = "Sheet", 
        rows = 16,
        cols = 8
    } = $props();
    // setup formulas
    let formulas = getContext("formulas"); 
    if (formulas.getSheetId(name) === undefined) {
        formulas.addSheet(name);
    }
    let sheet = formulas.getSheetId(name)
    // get selection element
    let selection = getContext("selection")
    // stores attributes about each cell
    let cells = $state(
        Array(rows).fill(
            Array(cols).fill({
                style: "",
                data: "",
                row: undefined,
                col: undefined,
                handle: undefined
            })
        )
    )
    // stores the content displayed by each cell
    let content = $derived.by(() => {
        // get data as a 2d array
        let data = [];
        for (let row in cells) {
            data.push([])
            for (let col in cells[row]) {
                data[row].push(
                    cells[row][col].data
                )
            }
        }
        // run formula engine
        formulas.setSheetContent(sheet, data)

        return formulas.getSheetValues(sheet)
    })
    // modifier keys
    let modifiers = getContext("modifiers")
    // restore focus to the entry
    let entry;
    function focusEntry(value) {
        // set entry value
        entry.value = value;
        // focus
        entry.focus()
    }
    setContext("focusEntry", focusEntry)
    // transformation functions for the table
    function addRow() {
        cells.push(
            Array(cells[0].length).fill({
                style: "",
                data: "",
                row: undefined,
                col: undefined,
                handle: undefined
            })
        )
    }
    function removeRow() {
        cells.pop()
    }
    function addCol() {
        for (let i in cells) {
            cells[i].push({
                style: "",
                data: ""
            })
        }
    }
    function removeCol() {
        for (let i in cells) {
            cells[i].pop()
        }
    }
    // convert between numeric and alphabetical indices
    function int2alpha(i) {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        if (i < letters.length) {
            // if single letter, return 
            return letters[i]
        } else {
            // if two letters, get both
            return letters[Math.floor(i / letters.length)-1] + letters[i % letters.length]
        }
    }
</script>

<input
    class=entry-box
    bind:this={entry}
    oninput={(evt) => {
        cells[selection.focus.row][selection.focus.col].data = entry.value;
    }}
>
<table>
    <tbody>
        <tr>
            <!-- all label -->
            <td 
                class=axis-lbl
                onclick={(evt) => {
                    // clear selection
                    selection.selected = []
                    // select all
                    for (let row in cells) {
                        selection.selected.push([])
                        for (let col in cells[row]) {
                            selection.selected.push(cells[row][col])
                        }
                    }
                }}
            >
                *
            </td>
            {#each [...Array(cells[0].length).keys()] as col}
            <!-- column label -->
            <td 
                class="col-lbl axis-lbl"
                onclick={(evt) => {
                    // clear selection
                    selection.selected = []
                    // shift selection if needed
                    if (selection.focus.col !== col) {
                        selection.focus = cells[0][col]
                    }
                    // select whole column
                    for (let row of cells) {
                        selection.selected.push(row[col])
                    }
                }}
            >
                {int2alpha(col)}
            </td>
            {/each}
            <td>
                <button 
                    class=add-col-btn
                    class:ctrlmode={modifiers.Control || modifiers.Command}
                    style:grid-column-start={2}
                    style:grid-column-end="span {cells[0].length}"
                    style:grid-row-start={cells.length + 2}
                    onclick={modifiers.Control || modifiers.Command ? removeCol : addCol}
                >
                    {modifiers.Control || modifiers.Command ? "-" : "+"}
                </button>
            </td>
        </tr>
        {#each [...Array(cells.length).keys()] as row}
        <tr>
            <!-- row label -->
            <td 
                class="row-lbl axis-lbl"
                onclick={(evt) => {
                    // clear selection
                    selection.selected = []
                    // shift selection if needed
                    if (selection.focus.row !== row) {
                        selection.focus = cells[row][0]
                    }
                    // select whole column
                    for (let cell of cells[row]) {
                        selection.selected.push(cell)
                    }
                }}
            >
                {row + 1}
            </td>
            {#each [...Array(cells[row].length).keys()] as col}
            <Cell
                row={row}
                col={col}
                siblings={cells}
                value={cells[row][col].data}
                content={content[row][col]}
            ></Cell>
            {/each}
        </tr>
        {/each}
        <tr>
            <td>
                <button
                    class="add-row-btn"
                    class:ctrlmode={modifiers.Control || modifiers.Command}
                    style:grid-column-start={2}
                    style:grid-column-end="span {cells[0].length}"
                    style:grid-row-start={cells.length + 2}
                    onclick={modifiers.Control || modifiers.Command ? removeRow : addRow}
                >
                    {modifiers.Control || modifiers.Command ? "-" : "+"}
                </button>
            </td>
        </tr>
    </tbody>
</table>

<svelte:window 
    on:keydown={
        (evt) => {
            // ESC: clear selection
            if (evt.key === "Escape") {
                // unfocus whichever cell has focus
                selection.focus = {
                    handle: undefined,
                    row: undefined,
                    col: undefined
                };
                // deselect whichever cells are selected          
                selection.selected = [];
            }
            // TAB: move on 1 col, or carriage return
            if (evt.key === "Tab") {
                if (selection.focus.handle) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // if this was first tab, set tab root
                    if (!selection.tabbing.active) {
                        selection.tabbing.root = $state.snapshot(selection.focus.col);
                    }
                    // take note that we're tabbing
                    selection.tabbing.active = true;
                    // get current row and col
                    let row = $state.snapshot(selection.focus.row);
                    let col = $state.snapshot(selection.focus.col);
                    // move one cell left/right according to shift mode
                    if (modifiers.Shift) {
                        col = Math.max(0, col-1)
                    } else {
                        col = Math.min(cells[row].length-1, col+1)
                    }
                    selection.focus = cells[row][col]
                }
            }
            // ENTER: carriage retun (or newline in shift mode)
            if (evt.key === "Enter") {
                if (selection.focus.handle) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // get current row and col
                    let row = $state.snapshot(selection.focus.row);
                    let col = $state.snapshot(selection.focus.col);
                    // move down or up 1 row according to shift condition
                    if (modifiers.Shift) {
                        row = Math.max(0, row-1);
                    } else {
                        row = Math.min(cells.length-1, row+1);
                    }
                    // if tabbing, return col to tab root
                    if (selection.tabbing.active) {
                        col = $state.snapshot(selection.tabbing.root);
                    }
                    // tabbing is no longer active
                    selection.tabbing.active = false;
                    // apply new focus
                    selection.focus = cells[row][col];
                }
            }
            // UP, DOWN, LEFT, RIGHT: move around sheet
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(evt.key)) {
                if (selection.focus.handle) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // stop tabbing
                    selection.tabbing.active = false;
                    selection.tabbing.root = 0;
                    // get current row and col
                    let row = $state.snapshot(selection.focus.row);
                    let col = $state.snapshot(selection.focus.col);
                    // adjust indices based on keypress
                    if (evt.key === "ArrowUp") {
                        row = Math.max(0, row-1);
                    }
                    if (evt.key === "ArrowDown") {
                        row = Math.min(cells.length-1, row+1);
                    }
                    if (evt.key === "ArrowLeft") {
                        col = Math.max(0, col-1);
                    }
                    if (evt.key === "ArrowRight") {
                        col = Math.min(cells[row].length-1, col+1);
                    }
                    // if holding shift, update selection
                    if (modifiers.Shift) {
                        // for each selected cell...
                        for (let cell of selection.selected) {
                            let target;
                            // get matching cell of same row/col (depending on direction) 
                            if (["ArrowUp", "ArrowDown"].includes(evt.key)) {
                                target = cells[row][cell.col]
                            } else (
                                target = cells[cell.row][col]
                            )
                            // add it to the selection
                            if (!selection.selected.includes(target)) {
                                selection.selected.push(target)
                            }
                        }
                    }
                    // apply new focus
                    selection.focus = cells[row][col];
                }
            }
        }
    }     
/>

<style>
    table {
        border-collapse: separate;
        border-spacing: 0;
        margin: 0;
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

    .row-lbl,
    .col-lbl,
    .axis-lbl {
        border: 1px solid transparent;
        background-color: var(--crust);
        border: 1px solid var(--overlay);
        box-sizing: border-box;
        text-align: center;
        padding: .25rem .5rem;
        margin: -0.5px;
    }
    .axis-lbl:hover {
        background-color: var(--mantle);
    }

    .add-col-btn,
    .add-row-btn {
        margin: .5rem;
        border-radius: .5rem;
        background-color: var(--crust);
        border: 1px solid var(--overlay);

    }
    .add-col-btn:hover,
    .add-row-btn:hover {
        color: var(--base);
        background-color: var(--green);
    }
    .add-col-btn.ctrlmode:hover,
    .add-row-btn.ctrlmode:hover {
        color: var(--base);
        background-color: var(--red);
    }
    .add-col-btn {
        margin: -1px;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 2rem;
        height: calc(100% + 2px);
    }
    .add-row-btn {
        margin: -1px;
        border-top: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        height: 2rem;
        width: calc(100% + 2px);
    }
</style>