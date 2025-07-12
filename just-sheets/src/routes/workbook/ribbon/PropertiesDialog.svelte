 <script>
    import { getContext, onMount } from "svelte";
    import { Dialog } from "$lib/dialog";
    import { schema } from "$lib/document"
    import ParamCtrl from "$lib/params/ParamCtrl.svelte";

    let doc = getContext("document")

    // buffer to store values - reset on cancel, applied on okay/apply
    let properties = Object.assign({}, doc.properties);

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
    title="Document properties"
    onokay={(evt) => {
        // apply properties buffer
        doc.properties = properties;
    }}
    oncancel={(evt) => {
        // reset properties buffer
        properties = Object.assign({}, doc.properties);
    }}
    onapply={(evt) => {
        // apply properties buffer
        doc.properties = properties;
    }}
>
    {#each [...Object.entries(schema.properties.properties.properties)] as [key, property]}
    <ParamCtrl
        key={key}
        schema={property}
        bind:value={properties[key]}
    ></ParamCtrl>
    {/each}
</Dialog>