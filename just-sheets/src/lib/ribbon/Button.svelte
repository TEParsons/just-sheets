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
    }

</style>