<script>
    import * as feather from 'feather-icons';
    import { onMount } from 'svelte';

    let {
        /** @prop @type {string} Icon's tag, from https://feathericons.com/ */
        tag="help-circle",
        /** @prop @type {string} Color of the icon (any valid CSS) */
        color="var(--outline)",
        /** @prop @type {string} Icon height */
        height="18px",
        /** @prop @type {integer} Stroke width (px) */
        thickness=2,
        /** @prop @type {integer} Stroke line join (arcs | bevel | miter | miter-clip | round) */
        join="bevel",
        /** @prop @type {integer} Stroke line join (arcs | bevel | miter | miter-clip | round) */
        cap="bevel",
    } = $props()

    onMount(() => feather.replace({
        // 'color': color,
        'height': height,
        'stroke-width': thickness,
        'stroke-linejoin': join,
        'stroke-linecap': cap,
    }))
</script>

<div 
    style:display=inline
    style:color={color}
>
    <i data-feather={tag}></i>
</div>

