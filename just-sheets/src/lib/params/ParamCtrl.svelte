<script>
    import SelectCtrl from "./ctrls/SelectCtrl.svelte";

    let {
        key = "",
        schema = {},
        value = $bindable()
    } = $props();

</script>

<div class=param-ctrl>

    <label for={key}>{schema.description}</label>

    <!-- choice ctrl -->
    {#if schema.oneOf}
    <SelectCtrl
        key={key}
        schema={schema}
        bind:value={value}
    ></SelectCtrl>
    {/if}

    
</div>

<style>
    .param-ctrl {
        display: grid;
        grid-template-rows: [label] min-content [ctrl] min-content [extra] min-content;
        grid-gap: .5rem;
        margin: 1rem;
        width: 42rem;
    }
</style>