 <script>
    import { Dialog } from "$lib/dialog";
    import { prefs as rootprefs, schema } from "$lib/preferences"
    import ParamCtrl from "$lib/params/ParamCtrl.svelte";
    import { Notebook, NotebookPage } from "$lib/notebook";

    let prefs = rootprefs;
    // buffer to store values - reset on cancel, applied on okay/apply
    let properties = Object.assign({}, prefs);

    let handle;
    export function showModal() {
        handle.showModal()
    }
    export function close() {
        handle.close()
    }
 </script>

<Dialog 
    bind:this={handle}
    title="Preferences"
    onokay={(evt) => {
        // apply properties buffer
        prefs = properties;
    }}
    oncancel={(evt) => {
        // reset properties buffer
        properties = Object.assign({}, prefs);
    }}
    onapply={(evt) => {
        // apply properties buffer
        prefs = properties;
    }}
>
    <Notebook>
        {#each [...Object.entries(schema.properties)] as [categName, categ]}
            <NotebookPage
                title={categ.title}
            >
                <h1>{categ.title}</h1>
                <p>{categ.description}</p>
                <hr>
                {#each [...Object.entries(categ.properties)] as [key, property]}
                    <ParamCtrl
                        key={key}
                        schema={property}
                        bind:value={properties[categName][key]}
                    ></ParamCtrl>
                {/each}
            </NotebookPage>
        {/each}
    </Notebook>
</Dialog>