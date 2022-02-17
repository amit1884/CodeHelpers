import { isEmpty } from "lodash";

export default function getSchemaJson(schemaJsonLd={}, commonSchema={}) {
    let schemaJson = {};
    let commonJson = {};
    if(schemaJsonLd){
      let count = 0;
      for(let i in schemaJsonLd){
        schemaJson[count] = schemaJsonLd[i]
        count++;
      }
    }
  
    if(commonSchema && !isEmpty(commonSchema)){
      let count = 0;
      for(let i in commonSchema){
        commonJson[count] = commonSchema[i]
        count++;
      }
    }

    return { schemaJson, commonJson };
}