<script>
    import FeatherIcon from "$lib/icons/FeatherIcon.svelte";
    import { 
        blur,
        crossfade,
        draw,
        fade,
        fly,
        scale,
        slide
    } from 'svelte/transition';

    let {
        /** @prop @type {string} Text label for this button, if any */
        label="",
        /** @prop @type {string} Name of the icon for this button */
        icon="help-circle",
        /** @prop @type {function} Function to call when this button is clicked */
        onclick=() => {},
        /** @prop @type {boolean} Disable this button */
        disabled=false
    } = $props()

    let hover = $state(false)
</script>

<button
    disabled={disabled} 
    onclick={onclick}
    onmouseenter={() => {hover = true}}
    onmouseleave={() => {hover = false}}
>
    {#if hover}
        <span 
            class=btn-label
            transition:slide={{axis: 1}}
        >
            {label}
        </span>
    {/if}
    <FeatherIcon tag={icon} color={hover ? "var(--blue)" : "var(--outline)"}></FeatherIcon>
</button>

<style>
    button {
        background-color: var(--base);
        padding: .5rem;
        padding-bottom: .25rem;
        display: grid;
        grid-auto-flow: column;
        gap: .2rem;
    }

    button:disabled {
        opacity: .5;
    }

    .btn-label {
        padding-left: .5rem;
        text-wrap: nowrap;
    }

</style>
