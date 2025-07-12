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

    let handles = $state({})
</script>

{#if shown}
<Ribbon>
    <RibbonSection label="File">
        <RibbonButton 
            label="New workbook" 
            icon=file-plus
        >
        </RibbonButton>
        <RibbonButton 
            label="Open" 
            icon=folder
        >
        </RibbonButton>
        <RibbonButton 
            label="Save"
            icon=save
        >
        </RibbonButton>
    </RibbonSection>
    <RibbonSection label="Style">
        <StylePicker></StylePicker>
        <RibbonButton 
            label="Manage styles"
            icon=sliders
        ></RibbonButton>
    </RibbonSection>
    <RibbonSection label="Settings">
        <RibbonButton 
            label="Document properties" 
            icon=file
            onclick={() => handles.propsDlg.showModal()}
            
        ></RibbonButton>
        <PropertiesDialog bind:this={handles.propsDlg}></PropertiesDialog>
        <RibbonButton 
            label="User preferences" 
            icon=user
            onclick={() => handles.prefsDlg.showModal()}
        ></RibbonButton>
        <PreferencesDialog bind:this={handles.prefsDlg}></PreferencesDialog>
    </RibbonSection>
</Ribbon>
{/if}

