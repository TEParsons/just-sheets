<script>
    import Ribbon from "./utils/Ribbon.svelte";
    import RibbonButton from "./utils/Button.svelte";
    import RibbonSection from "./utils/Section.svelte";
    import RibbonSelect from "./utils/Select.svelte";

    import StylePicker from "./StylePicker.svelte";

    export let shown = writable(true);
</script>

{#if $shown}
<Ribbon>
    <RibbonSection label="Style">
        <StylePicker></StylePicker>
        <RibbonButton label="Manage styles"></RibbonButton>
    </RibbonSection>
</Ribbon>
{/if}

