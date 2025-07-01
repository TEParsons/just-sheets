import jsonSchemaDefaults from "json-schema-defaults";
import rawSchema from "./jbook/jbook.schema.json"

export const schema = rawSchema;
export const defaults = jsonSchemaDefaults(schema);


export class Document extends Object {
    constructor() {
        super();
        this.properties = defaults.properties
        this.data = defaults.data
        this.style = defaults.style
    }
}