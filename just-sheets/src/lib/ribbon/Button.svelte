<script>
    let {
        label=undefined,
        icon=undefined,
        onclick=(evt) => {}
    } = $props()

</script>

<button
    onclick={onclick}
>
    <span>{label}</span>
    {#if icon}
    <img src={icon} alt={label} />
    {/if}
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