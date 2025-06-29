<script>
    import { Dialog } from "$lib/dialog"
    let {
        label=undefined,
        icon=undefined,
        snippet=undefined
    } = $props()

    let dlg;

</script>

<button
    onclick={() => dlg.showModal()}
>
    <span>{label}</span>
    {#if icon}
    <img src={icon} alt={label} />
    {/if}
    <Dialog
        bind:this={dlg}
    >
        {#if snippet}
        {@render snippet()}
        {/if}
    </Dialog>
    
</button>

<style>
    button {
        background-color: var(--base);
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: .5rem 1rem;
    }
    button:enabled:hover {
        border-color: var(--blue);
    }

</style>