 <script>
    import { Dialog } from "$lib/dialog";
    import { prefs as rootPrefs, schema } from "$lib/preferences"
    import PrefCtrl from "$lib/preferences/PrefCtrl.svelte";

    let handle;
    export function showModal() {
        handle.showModal()
    }
    export function close() {
        handle.close()
    }
    let prefs = $state(rootPrefs)

 </script>

<Dialog 
    bind:this={handle}
    title="Preferences"
    onokay={(evt) => {}}
    oncancel={(evt) => {}}
    onapply={(evt) => {}}
>
    {#each [...Object.entries(schema.properties)] as [key, property]}
    <PrefCtrl
        key={key}
        schema={property}
        bind:prefs={prefs}
    ></PrefCtrl>
    {/each}
</Dialog>