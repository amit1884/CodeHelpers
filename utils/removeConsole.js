import { getIsServer } from "~/utils/common";
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT

if(!getIsServer() && environment==='PRODUCTION'){
    console.log = function(){};
}