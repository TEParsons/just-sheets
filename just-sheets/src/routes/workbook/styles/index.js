import packagedStyles from "./packaged_styles.json";

export const allStyles = {};

/**
 * Converts a JS object to a valid CSS string
 * 
 * @param {object} obj Object to convert to a CSS string
 */
function object2css(obj) {
    // start off blank
    let output = "";
    // iterate through keys and values
    for (let [key, val] of [...Object.entries(obj)]) {
        // add key:value pair as a CSS string
        output += `${key}: ${val}; `
    }

    return output
}

for (let [name, style] of [...Object.entries(packagedStyles)]) {
    allStyles[name] = object2css(style);
    
}