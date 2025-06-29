<script>
    export let label;
</script>

<div
    class=ribbon-section
>
    <slot></slot>
    <div
        class=ribbon-section-label
    >
        {label}
    </div>
</div>

<style>
    .ribbon-section {
        display: grid;
        position: relative;
        grid-auto-flow: column;
        grid-template-rows: [top] 1fr [divide] 1rem [bottom];
        padding-top: 1rem;
        justify-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .ribbon-section>:global(*):not(.ribbon-section-label) {
        grid-row-start: top;
    }
    .ribbon-section-label {
        position: absolute;
        bottom: 0;
    }
    .ribbon-section:not(:first-child) {
        border-left: 1px solid var(--overlay)
    }
</style>