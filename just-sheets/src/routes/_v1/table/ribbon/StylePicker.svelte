<script>
    import { getContext } from "svelte";
    import { get } from "svelte/store";
    import styles from "../../styles/packaged_styles.json";

    let selection = getContext("selection");
    let focus = getContext("focus");

    function getStyle() {
        if ($focus) {
            return get($focus.style)
        } else {
            return null
        }
    }

    function setStyle(value) {
        for (let cell of $selection) {
            cell.style.set(value)
        }
    }
</script>

<select 
    bind:value={getStyle, setStyle}
    disabled={!$selection.length}
>
    <option val={null}>None</option>
    {#each Object.keys(styles) as styleName}
    <option val={styleName}>{styleName}</option>
    {/each}
</select>

<style>
    select {
        font-size: 1rem;
        border-radius: .5rem;
        padding: .5rem;
        border: 1px solid var(--overlay);
        outline: none;
        transition: border-color .5s;
    }
    select:enabled:hover {
        border-color: var(--blue);
    }
</style>