<script>
    import { getContext } from "svelte";
    import { get } from "svelte/store";
    import styles from "../styles/packaged_styles.json";

    let selection = getContext("selection");

    function getStyle() {
        if (selection.focus) {
            return selection.focus.style
        } else {
            return null
        }
    }

    function setStyle(value) {
        for (let cell of selection.selected) {
            cell.style = value;
        }
    }
</script>

<select 
    bind:value={getStyle, setStyle}
    disabled={!selection.selected.length}
>
    <option val={null} class=special-option></option>
    {#each Object.keys(styles) as styleName}
    <option value={styleName}>{styleName}</option>
    {/each}
    <option value="=" class="formula-option special-option">Formula...</option>
    
</select>

<style>
    .special-option {
        background-color: var(--mantle);
    }
    .formula-option {
        color: var(--blue);
    }
</style>