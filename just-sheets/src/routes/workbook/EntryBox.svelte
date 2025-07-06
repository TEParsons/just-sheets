<script>
    import { getContext } from "svelte"; 

    // store handle on input element
    let input;
    // get context from parent
    let selection = getContext("selection");
    let modifiers = getContext("modifiers");
    // if focus moves outside selection...
    $effect(() => {
        if (!selection.selected.includes(selection.focus)) {
            // if pressing control, add focus to selection
            if (modifiers.Control) {
                selection.selected.push(selection.focus);
            } else {
                // otherwise, focus is the new selection
                selection.selected = [selection.focus];
            }
        }
        // focus and reset entry box
        input.value = selection.focus[mode] ? selection.focus[mode] : "";
        input.focus();
    })
    // toggle for entry mode
    let mode = $state("data")
    
</script>

<div class=entry-box>
    <input
        bind:this={input}
        class:style-entry={selection.focus.handle && mode === "style"}
        class:data-entry={selection.focus.handle && mode === "data"}
        class:note-entry={selection.focus.handle && mode === "note"}
        disabled={selection.focus.handle === undefined}
        oninput={(evt) => {
            selection.focus[mode] = input.value;
        }}
    >
    <select
        class=mode-toggle
        bind:value={mode}
        disabled={selection.focus.handle === undefined}
    >
        <option value="data">Data</option>
        <option value="style" selected>Style</option>
        <option value="note">Note</option>
    </select>
</div>

<style>
    .entry-box {
        display: grid;
        grid-template-columns: [input] 1fr [mode] min-content;
        margin: 1rem;
        gap: .5rem;
    }
    .style-entry {
        border: 1px solid var(--purple);
    }
    .note-entry {
        border: 1px solid var(--yellow);
    }
</style>