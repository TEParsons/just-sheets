<script>
    let {
        title="",
        onokay=undefined,
        onapply=undefined,
        oncancel=undefined,
        children
    } = $props()

    let handle;
    export function showModal() {
        handle.showModal()
    }    
</script>


<dialog
    bind:this={handle}
>
    <div class=dlg-title>
        <span>
            {title}
        </span>
        <div class=dlg-title-ctrls>
            <button
                class="title-button close-button"
                onclick={() => handle.close()}
            >
                ✖
            </button>
        </div>
    </div>
    <div class=dlg-content>
        {@render children()}
    </div>
    <div class=dlg-ctrls>
        {#if oncancel}
        <button
            class="close-button dlg-button"
            onclick={(evt) => {
                oncancel(evt)
                handle.close()
            }}
        >
            Cancel
        </button>
        {/if}
        {#if onapply}
        <button
            class=dlg-button
            onclick={(evt) => {
                onapply(evt)
            }}
        >
            Apply
        </button>
        {/if}
        {#if onokay}
        <button
            class="primary-button dlg-button"
            onclick={(evt) => {
                onokay(evt)
                handle.close()
            }}
        >
            Okay
        </button>
        {/if}
    </div>
</dialog>

<style>
    dialog {
        border: 1px solid var(--outline);
        border-radius: .5rem;
        display: grid;
        grid-template-rows: [title] min-content [content] auto [ctrls] min-content;
        padding: 0;
    }
    dialog:not(:open) {
        display: none;
    }   
    
    .dlg-title {
        display: grid;
        position: relative;
        grid-template-columns: [label] 1fr [ctrls] min-content;
        background-color: var(--overlay);
    }
    .dlg-title span {
        line-height: 1rem;
        padding: 1rem;
    }
    .title-button {
        line-height: 1rem;
        height: 100%;
        border: none;
        outline: none;
        background-color: transparent;
        padding: .5rem 1rem;
    }
    .title-button:hover {
        background-color: var(--mantle);
    }
    .title-button.close-button:hover {
        background-color: var(--red);
        color: white;
    }

    .dlg-ctrls {
        display: grid;
        grid-auto-flow: column;
        justify-content: end;
        grid-gap: 1rem;
        padding: 1rem;
    }
    .dlg-button.primary-button {
        background-color: var(--blue);
        color: var(--base);
    }
    .dlg-button.primary-button:hover {
        background-color: var(--blue);
        border-color: var(--base);
    }
    .dlg-button.close-button:hover {
        background-color: var(--red);
        color: var(--base);
    }
    .dlg-button {
        background-color: var(--crust);
        border: 1px solid var(--overlay);
        outline: none;
        border-radius: .5rem;
        padding: .5rem 1rem;
    }
    .dlg-button:hover {
        background-color: var(--mantle)
    }

    .dlg-content {
        min-width: 32rem;
        min-height: 32rem;
        padding: 1rem;
    }
</style>