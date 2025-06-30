<script>
    // generic UI tools
    import { Ribbon, RibbonSection, RibbonButton, RibbonDialogButton, RibbonSelect } from "$lib/ribbon";
    import { Dialog } from "$lib/dialog";
    // specific components
    import StylePicker from "./StylePicker.svelte";
    import PreferencesDialog from "./PreferencesDialog.svelte"
    import PropertiesDialog from "./PropertiesDialog.svelte"

    let {
        shown = $bindable(true)
    } = $props()

    let handles = {}

</script>

{#if shown}
<Ribbon>
    <RibbonSection label="Style">
        <StylePicker></StylePicker>
        <RibbonButton label="Manage styles"></RibbonButton>
    </RibbonSection>
    <RibbonSection label="Settings">
        <RibbonButton label="Preferences" onclick={() => handles.prefsDlg.showModal()}></RibbonButton>
        <PreferencesDialog bind:this={handles.prefsDlg}></PreferencesDialog>
        <RibbonButton label="Properties" onclick={() => handles.propsDlg.showModal()}></RibbonButton>
        <PropertiesDialog bind:this={handles.propsDlg}></PropertiesDialog>
    </RibbonSection>
</Ribbon>
{/if}

