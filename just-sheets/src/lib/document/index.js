import jsonSchemaDefaults from "json-schema-defaults";
import rawSchema from "./jbook/jbook.schema.json";
import headersTemplate from "./templates/headers.template.jbook.json";
let templates = {
    headers: headersTemplate
};

export const schema = rawSchema;
export const defaults = jsonSchemaDefaults(schema);

export function newDocument(template=null) {
    if (template in templates) {
        return Object.assign({}, templates[template])
    } else {
        return jsonSchemaDefaults(schema)
    }
}

export function newSheet(template=null) {
    let workbook
    if (template in templates) {
        workbook = templates[template]
        
    } else {
        workbook = jsonSchemaDefaults(schema)
    }
    
    return Object.assign({}, workbook.data[Object.keys(workbook.data)[0]])
}