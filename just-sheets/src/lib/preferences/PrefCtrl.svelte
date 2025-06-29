<script>
    let {
        key="",
        schema={},
        prefs = $bindable({})
    } = $props();
</script>

<div class=pref-ctrl>

    <label for={key}>{schema.description}</label>

    <!-- choice ctrl -->
    {#if schema.oneOf}
    <select
        bind:value={prefs[key]}
        id={key}
    >
        {#each schema.oneOf as val}
        <option value={val.const}>{val.title}</option>
        {/each}
    </select>
    {#each schema.oneOf as val}
    {#if val.const === prefs[key]}
    <blockquote>
        {val.description}
        {#each val.examples as example}
        <pre>{example}</pre>
        {/each}
    </blockquote>
    {/if}
    {/each}
    {/if}

    
</div>

<style>
    .pref-ctrl {
        display: grid;
        grid-template-rows: [label] min-content [ctrl] min-content [extra] min-content;
        grid-gap: .5rem;
        margin: 1rem;
        width: 42rem;
    }
    select {
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        outline: none;
        padding: .5rem;
    }
    blockquote {
        margin: 0 1rem;
        color: var(--outline);
    }
    pre {
        font-family: var(--mono)
    }
</style>