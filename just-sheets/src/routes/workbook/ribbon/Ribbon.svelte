<script>
    import { Ribbon, RibbonSection, RibbonButton, RibbonSelect } from "$lib/ribbon";
    import StylePicker from "./StylePicker.svelte";

    let {
        shown = $bindable(true)
    } = $props()
</script>

{#if shown}
<Ribbon>
    <RibbonSection label="Style">
        <StylePicker></StylePicker>
        <RibbonButton label="Manage styles"></RibbonButton>
    </RibbonSection>
</Ribbon>
{/if}

