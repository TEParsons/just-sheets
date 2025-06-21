<script>
    import { getContext } from "svelte";
    import { writable, derived, get } from "svelte/store"

    let focus = getContext("focus");
    export let handle;

    let nocell = writable("");
    let value = nocell;
    focus.subscribe((focus) => {
        if (focus === null || focus === undefined) {
            value = nocell;
            return
        }

        value = focus.value
    })


    
</script>

<input
    type=text
    class=entry-box
    disabled={!$focus}
    bind:this={handle}
    bind:value={
        () => $value,
        (content) => value.set(content)
    }
>

<style>
    .entry-box {
        padding: .5rem;
        border: 1px solid var(--overlay);
        outline: none;
        border-radius: .5rem;
    }
    .entry-box:focus {
        border: 1px solid var(--blue);
    }
</style>