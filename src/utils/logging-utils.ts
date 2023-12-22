import { nowDateTime} from "./time-utils";


const debug: boolean = <boolean><unknown>process.env.DEBUG_LOG_ACTIVE ?? false;
export function debugLog(action: string, message: string, error: boolean = false){
    if(debug){
        console.log(`${nowDateTime()} | ${action} |${error ? " ERROR |" : ""} ${message}`)
    }
}