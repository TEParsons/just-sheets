<script>
    import { onMount, getContext } from "svelte";
    import Cell from "./Cell.svelte";
    import { writable, get } from "svelte/store";

    export let initialRows = 16;
    export let initialCols = 8;

    let rows = writable(initialRows);
    let cols = writable(initialCols);

    let ctrlmode = writable(false);
    let shiftmode = writable(false);
    let altmode = writable(false)
    let keyModifiers = {
        Control: ctrlmode,
        Command: ctrlmode,
        Shift: shiftmode,
        Alt: altmode,
    }
    let tabRoot = {
        tabbing: false, col: 0
    };

    let cells = {};

    let selection = getContext("selection");
    let focus = getContext("focus");
    focus.subscribe((value) => {
        tabRoot.tabbing = false;
        tabRoot.col = 0;
    })

    function indexCells(row, col) {
        // start with array of all cells
        let targets = Object.values(cells);
        // filter cells by row
        if (row !== ":") {
            targets = targets.filter((value) => value.row === row)
        }
        // filter cells by col
        if (col !== ":") {
            targets = targets.filter((value) => value.col === col)
        }

        return targets
    }

</script>

<div
    class=grid
>
    <button
        class=axis-lbl
        style:grid-row-start={1}
        style:grid-column-start={1}
        on:click={(evt) => selection.set(indexCells(":", ":"))}
    >*</button>
    {#each [...Array($cols).keys()] as col}
    <button
            class=col-lbl
            aria-label={`col${col}lbl`}
            style:grid-row-start={1}
            style:grid-column-start={col+2}
            on:click={(evt) => selection.set(indexCells(":", col))}
        >{col+1}</button>
    {/each}
    {#each [...Array($rows).keys()] as row}
        <button
            class=row-lbl
            aria-label={`row${row}lbl`}
            style:grid-row-start={row+2}
            style:grid-column-start={1}
            on:click={(evt) => selection.set(indexCells(row, ":"))}
        >{row+1}</button>
        {#each [...Array($cols).keys()] as col}
        <Cell
            bind:data={cells[`${col},${row}`]}
            col={col}
            row={row}
        ></Cell>
        {/each}
        <button
            class="add-col-btn"
            class:ctrlmode={$ctrlmode}
            aria-label="+col"
            style:grid-row-start={2}
            style:grid-row-end="span {$rows}"
            style:grid-column-start={$cols + 2}
            on:click={(evt) => $cols += $ctrlmode ? -1 : 1 }
        >
            {$ctrlmode ? "-" : "+"}
        </button>
    {/each}
    <button
        class="add-row-btn"
        class:ctrlmode={$ctrlmode}
        aria-label="+row"
        style:grid-column-start={2}
        style:grid-column-end="span {$cols}"
        style:grid-row-start={$rows + 2}
        on:click={(evt) => $rows += $ctrlmode ? -1 : 1 }
    >
        {$ctrlmode ? "-" : "+"}
    </button>
</div>

<svelte:window 
    on:keydown={
        (evt) => {
            // CTRL, CMD, ALT, SHIFT: set modifier mode
            if (evt.key in keyModifiers && !get(keyModifiers[evt.key])) {
                keyModifiers[evt.key].set(true)
            }
            // ESC: clear selection
            if (evt.key === "Escape") {
                // unfocus whichever cell has focus
                focus.set(null)      
                // deselect whichever cells are selected          
                selection.set([])
            }
            // TAB: move on 1 col, or carriage return
            if (evt.key === "Tab") {
                if ($focus) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // if this was first tab, set tab root
                    if (!tabRoot.tabbing) {
                        tabRoot.col = $focus.col
                    }
                    // preserve tab root for when focus overwrites it
                    let preservedTabRoot = tabRoot.col
                    // flip direction in shift mode
                    let flip = $shiftmode ? -1 : 1
                    // get cell 1 to the right
                    let targets = indexCells($focus.row, $focus.col+1*flip)
                    // if no cell 1 to the right, move on to next row
                    if (!targets.length) {
                        targets = indexCells($focus.row+1*flip, $shiftmode ? $cols - 1 : tabRoot.col)
                    }
                    // if no next row, move back to origin
                    if (!targets.length) {
                        targets = indexCells(0, 0)
                    }
                    focus.set(targets[0])
                    // restore tab root
                    tabRoot.col = preservedTabRoot
                    tabRoot.tabbing = true
                }
            }
            // ENTER: carriage retun (or newline in shift mode)
            if (evt.key === "Enter") {
                if ($focus) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // behave differently according to shift mode
                    if ($shiftmode) {
                        // add a newline
                        $focus.handle.value += "\n"
                    } else {
                        // carriage return
                        let targets = indexCells($focus.row+1, tabRoot.col)
                        // move
                        if (targets.length) {
                            focus.set(targets[0])
                        }
                    }
                }
            }
            // UP, DOWN, LEFT, RIGHT: move around sheet
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(evt.key)) {
                if ($focus) {
                    // stop normal behaviour
                    evt.preventDefault();
                    // get new cell
                    let targets;
                    if (evt.key === "ArrowUp") {
                        targets = indexCells($focus.row-1, $focus.col)
                    }
                    if (evt.key === "ArrowDown") {
                        targets = indexCells($focus.row+1, $focus.col)
                    }
                    if (evt.key === "ArrowLeft") {
                        targets = indexCells($focus.row, $focus.col-1)
                    }
                    if (evt.key === "ArrowRight") {
                        targets = indexCells($focus.row, $focus.col+1)
                    }
                    // move
                    if (targets.length) {
                        focus.set(targets[0])
                    }
                }
            }
        }
    } 
    on:keyup={
        (evt) => {
            // CTRL, CMD, ALT, SHIFT: leave modifier mode
            if (evt.key in keyModifiers && get(keyModifiers[evt.key])) {
                keyModifiers[evt.key].set(false)
            }
        }
    } 
/>

<style>
    .grid {
        display: grid;
        align-content: start;
        justify-content: start;
    }

    .row-lbl,
    .col-lbl,
    .axis-lbl {
        border: 1px solid transparent;
        background-color: var(--crust);
        border: 1px solid var(--overlay);
        display: grid;
        box-sizing: border-box;
        align-content: center;
        justify-content: center;
        padding: .25rem .5rem;
        margin: -0.5px;
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
        margin-left: 0;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        width: 2rem;
    }
    .add-row-btn {
        margin-top: 0;
        border-top: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        height: 2rem;
    }
</style>