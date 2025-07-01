import jsonSchemaDefaults from "json-schema-defaults";
import rawSchema from "./preferences.schema.json";

export let schema = rawSchema;
export let prefs = jsonSchemaDefaults(schema);

function loadPrefs(file) {

}

function savePrefs(file) {

}