 <script>
    import { getContext } from "svelte";
    import { Dialog } from "$lib/dialog";
    import { schema } from "$lib/document"
    import PrefCtrl from "$lib/preferences/PrefCtrl.svelte";

    let handle;
    export function showModal() {
        handle.showModal()
    }
    export function close() {
        handle.close()
    }

    let doc = getContext("document")
    console.log(doc)

 </script>

<Dialog 
    bind:this={handle}
    title="Properties"
    onokay={(evt) => {}}
    oncancel={(evt) => {}}
    onapply={(evt) => {}}
>
    {#each [...Object.entries(schema.properties.properties.properties)] as [key, property]}
    <PrefCtrl
        key={key}
        schema={property}
        bind:prefs={doc.properties}
    ></PrefCtrl>
    {/each}
</Dialog>