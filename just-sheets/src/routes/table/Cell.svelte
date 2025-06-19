<script>
    import { getContext } from "svelte";
    import { writable } from "svelte/store";


    export let col;
    export let row;

    let style = writable(undefined);
    export let data = {
        handle: undefined,
        row: row,
        col: col,
        style: style
    };

    let selection = getContext("selection");
    let focus = getContext("focus");

    function getStyleString(name) {
        let output = "";
        if (name in styles) {
            for (let key in styles[name]) {
                output += `${key}: ${styles[name][key]}; `;
            }
        }
        
        return output
    }

    import styles from "../styles/packaged_styles.json";
</script>

<input 
    class=cell
    id=cell-{row}-{col}
    type=text 
    bind:this={data.handle}
    class:selected={$selection.includes(data)}
    class:focus={$focus === data}
    style:grid-row-start={parseInt(row)+2}
    style:grid-column-start={parseInt(col)+2}
    style={getStyleString($style)}
    on:focusin={(evt) => {
        // set reported focus
        focus.set(data)
        // add to / replace selection
        selection.update(
            (value) => {
                if (value.includes(data)) {
                    return value
                }

                return [data]
            }
        )
    }}
>



<style>
    .cell {
        border: 1px solid var(--crust);
        border-radius: 0;
        margin: -0.5px;
        padding: .5rem;
        outline: none;
        z-index: 0;
    }
    .cell.selected {
        outline: none;
        border-color: var(--blue);
        z-index: 1;
        background-color: var(--crust)
    }
    .cell.focus {
        background-color: #ffffff;
    }
</style>