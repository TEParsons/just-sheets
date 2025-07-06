<script>
    import { getContext } from "svelte";
    import { allStyles } from "./styles";

    let {
        row = undefined,
        col = undefined,
        siblings = undefined,
        value = undefined,
        content = undefined,
        children
    } = $props();
    // get info
    let info = siblings[row][col]
    info.row = row;
    info.col = col;
    // get context
    let selection = getContext("selection")
    let modifiers = getContext("modifiers")
    let formulas = getContext("formulas")
    let sheet = getContext("sheet")

    let style = $derived.by(() => {
        if (info.style.startsWith("=")) {
            try {
                return formulas.calculateFormula(info.style, sheet)
            } catch {
                return null
            }
        } else {
            return info.style
        }
    })
</script>

<td
    bind:this={info.handle}
    class=cell
    class:has-note={info.note}
    style={allStyles[style]}
    onclick={() => {
        // if holding shift, expand selection
        if (modifiers.Shift) {
            // get indices of last selection
            let oldRow = $state.snapshot(selection.focus.row);
            let oldCol = $state.snapshot(selection.focus.col);
            // get cells between there and here
            let targets = [];
            for (let targetRow of siblings.slice(
                Math.min(oldRow, info.row), Math.max(oldRow, info.row)+1
            )) {
                for (let target of targetRow.slice(
                    Math.min(oldCol, info.col), Math.max(oldCol, info.col)+1
                )) {
                    targets.push(target)
                }
            }
            // add to selection
            selection.selected = targets;
        } else {
            // set focus
            selection.focus = info;
        }
    }}
    class:focus={selection.focus.row === row && selection.focus.col === col}
    class:selected={selection.selected.includes(info)}
    class:has-formula={String(value).startsWith("=")}
>
    {content}
    {#if info.note}
    <div 
        class=note
        style={allStyles[style]}
    >
        {info.note}
    </div>
    {/if}
</td>

<style>
    .cell {
        position: relative;
        overflow: visible;
        border: 1px solid var(--crust);
        border-radius: 0;
        padding: .5rem 1rem;
        box-sizing: border-box;
        height: calc(1em + 1rem);
        min-height: calc(1em + 1rem);
        width: 8em;
        min-width: calc(1em + 1rem);
        line-height: 1em;
        z-index: 0;
    }
    .cell.selected {
        border-color: var(--blue);
        background-color: var(--crust)
    }
    .cell.focus {
        background-color: var(--base);
        z-index: 1;
    }
    .cell.has-formula::after {
        content: "∫";
        font-weight: bold;
        font-size: 1.2rem;
        position: absolute;
        top: .5rem;
        left: .5rem;
        color: var(--overlay);
    }
    .cell.has-formula:hover::after,
    .cell.has-formula.focus::after {
        color: var(--blue);
    }
    .cell.has-note::after {
        content: "";
        position: absolute;
        top: 0; right: 0;
        border-left: .3rem solid transparent;
        border-right: .3rem solid var(--yellow);
        border-bottom: .3rem solid transparent;
        border-top: .3rem solid var(--yellow);
    }

    .note {
        display: none;
        position: absolute;
        left: calc(100% + .5rem); top: .5rem;
        padding: 1rem;
        border: 1px solid var(--yellow);
        max-width: 20rem;
        inline-size: max-content;
        border-radius: .5rem;
        background-color: var(--base);
        box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.1);
        z-index: 1;
    }
    .cell.focus .note {
        display: block;
    }
</style>