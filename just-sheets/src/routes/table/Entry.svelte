<script>
    import { getContext } from "svelte";

    let focus = getContext("focus");
    export let handle;


    
</script>

<input
    type=text
    class=entry-box
    disabled={!$focus}
    bind:this={handle}
    value={$focus ? $focus.handle.value : ""}
    on:input={(evt) => {
        if ($focus) {
            $focus.handle.value = handle.value;
        }
    }}
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