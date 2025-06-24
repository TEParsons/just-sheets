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
    // stores the raw data of this table
    let data = $state(
        Array(rows).fill(
            Array(cols).fill("")
        )
    )
    // stores the content displayed by each cell
    let content = $derived.by(() => {
        formulas.setSheetContent(sheet, data)
        return formulas.getSheetValues(sheet)
    })
    // stores other attributes about each cell
    let cells = $state(
        Array(rows).fill(
            Array(cols).fill({
                style: "",
                row: undefined,
                col: undefined,
                handle: undefined
            })
        )
    )
    // stores key modifiers
    let modifiers = $state({
        Control: false,
        Command: false,
        Alt: false,
        Shift: false
    })
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
                row: undefined,
                col: undefined,
                handle: undefined
            })
        )
        data.push(
            Array(cells[0].length).fill("")
        )
    }
    function removeRow() {
        cells.pop()
        data.pop()
    }
    function addCol() {
        for (let i in cells) {
            cells[i].push({
                style: ""
            })
            data[i].push("")
        }
    }
    function removeCol() {
        for (let i in cells) {
            cells[i].pop()
            data[i].pop()
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
    oninput={(evt) => data[selection.focus.row][selection.focus.col] = entry.value}
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
                    // select whole column
                    for (let row of cells) {
                        selection.selected.push(row[col])
                    }
                    // shift focus if needed
                    if (selection.focus.col !== col) {
                        selection.focus.col = col
                        selection.focus.handle = cells[selection.focus.row][col]
                    }
                }}
            >
                {int2alpha(col)}
            </td>
            {/each}
            <td rowspan={cells.length + 1}>
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
                    // select whole column
                    for (let cell of cells[row]) {
                        selection.selected.push(cell)
                    }
                    // shift focus if needed
                    if (selection.focus.row !== row) {
                        selection.focus.row = row
                        selection.focus.handle = cells[row][selection.focus.col]
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
                value={data[row][col]}
                content={content[row][col]}
            ></Cell>
            {/each}
        </tr>
        {/each}
        <tr>
            <td></td>
            <td colspan={cells[0].length}>
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
            // CTRL, CMD, ALT, SHIFT: set modifier mode
            if (evt.key in modifiers && !modifiers[evt.key]) {
                modifiers[evt.key] = true
            }
            // ESC: clear selection
            if (evt.key === "Escape") {
                // unfocus whichever cell has focus
                selection.focus.handle = undefined;
                selection.focus.row = undefined;
                selection.focus.col = undefined;
                // deselect whichever cells are selected          
                selection.selected = []
            }
            // TAB: move on 1 col, or carriage return
            if (evt.key === "Tab") {
                if (selection.focus) {
                    // // stop normal behaviour
                    // evt.preventDefault();
                    // // if this was first tab, set tab root
                    // if (!tabRoot.tabbing) {
                    //     tabRoot.col = $focus.col
                    // }
                    // // preserve tab root for when focus overwrites it
                    // let preservedTabRoot = tabRoot.col
                    // // flip direction in shift mode
                    // let flip = $shiftmode ? -1 : 1
                    // // get cell 1 to the right
                    // let targets = indexCells($focus.row, $focus.col+1*flip)
                    // // if no cell 1 to the right, move on to next row
                    // if (!targets.length) {
                    //     targets = indexCells($focus.row+1*flip, $shiftmode ? $cols - 1 : tabRoot.col)
                    // }
                    // // if no next row, move back to origin
                    // if (!targets.length) {
                    //     targets = indexCells(0, 0)
                    // }
                    // focus.set(targets[0])
                    // // restore tab root
                    // tabRoot.col = preservedTabRoot
                    // tabRoot.tabbing = true
                }
            }
            // ENTER: carriage retun (or newline in shift mode)
            if (evt.key === "Enter") {
                // if ($focus) {
                //     // stop normal behaviour
                //     evt.preventDefault();
                //     // behave differently according to shift mode
                //     if ($shiftmode) {
                //         // add a newline
                //         $focus.handle.value += "\n"
                //     } else {
                //         // carriage return
                //         let targets = indexCells($focus.row+1, tabRoot.col)
                //         // move
                //         if (targets.length) {
                //             focus.set(targets[0])
                //         }
                //     }
                // }
            }
            // UP, DOWN, LEFT, RIGHT: move around sheet
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(evt.key)) {
                // if ($focus) {
                //     // stop normal behaviour
                //     evt.preventDefault();
                //     // get new cell
                //     let targets;
                //     if (evt.key === "ArrowUp") {
                //         targets = indexCells($focus.row-1, $focus.col)
                //     }
                //     if (evt.key === "ArrowDown") {
                //         targets = indexCells($focus.row+1, $focus.col)
                //     }
                //     if (evt.key === "ArrowLeft") {
                //         targets = indexCells($focus.row, $focus.col-1)
                //     }
                //     if (evt.key === "ArrowRight") {
                //         targets = indexCells($focus.row, $focus.col+1)
                //     }
                //     // move
                //     if (targets.length) {
                //         focus.set(targets[0])
                //     }
                // }
            }
        }
    } 
    on:keyup={
        (evt) => {
            // CTRL, CMD, ALT, SHIFT: leave modifier mode
            if (evt.key in modifiers && modifiers[evt.key]) {
                modifiers[evt.key] = false
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
        margin: 1rem -1px;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 2rem;
        height: calc(100% - 2rem);
    }
    .add-row-btn {
        margin: -1px 1rem;
        border-top: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        height: 2rem;
        width: calc(100% - 2rem);
    }
</style>