<script>
    let {
        key = "",
        schema = {},
        value = $bindable({})
    } = $props();
    
</script>


<select
    bind:value={value}
>
    {#each schema.oneOf as val}
        <option value={val.const}>{val.title}</option>
    {/each}
</select>
{#each schema.oneOf as val}
    {#if val.const === value}
        <blockquote>
            {#if val.accreditation}
                <p>Powered by</p>
                <img class=accreditation src={val.accreditation} alt=accreditation />
            {/if}
            <p>
                {val.description}
            </p>
            {#each val.examples as example}
                <pre>{example}</pre>
            {/each}
        </blockquote>
    {/if}
{/each}


<style>
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
    img.accreditation {
        height: 1.5rem;
    }

    p {
        margin: .5rem 0;
    }
    p:first-child {
        margin-top: 0;
    }
</style>