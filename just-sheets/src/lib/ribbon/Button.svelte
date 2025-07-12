<script>
    let {
        /** @prop @type {string} Text label for this button, if any */
        label="",
        /** @prop @type {string} Icon for this section, if any */
        icon=undefined,
        /** @prop @type {function} Function to call when this button is clicked */
        onclick=() => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false
    } = $props()

</script>

<button
    disabled={disabled} 
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

    button:disabled {
        opacity: .5;
    }

</style>
