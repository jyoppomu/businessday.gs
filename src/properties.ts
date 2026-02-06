const scriptProperties = PropertiesService.getScriptProperties();
const scriptPropertyNames = ["GOOGLE_JAPANESE_HOLIDAY_CALENDAR_ID"] as const;

type ScriptPropertyName = (typeof scriptPropertyNames)[number];
type ScriptPropertyMap = Record<ScriptPropertyName, string>;

const properties = scriptPropertyNames.reduce<ScriptPropertyMap>(
  (acc, name) => {
    const value = scriptProperties.getProperty(name);
    if (value === null) {
      throw new Error(`unset script properties for ${name}.`);
    }
    acc[name] = value;
    return acc;
  },
  {} as ScriptPropertyMap
);

export default properties;
