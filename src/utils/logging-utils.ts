import { nowDateTime} from "./time-utils";

export function debugLog(action: string, message: string, error: boolean = false){
    const debug: boolean = process.env.DEBUG_LOG_ACTIVE === 'true';
    if(debug){
        console.log(`${nowDateTime()} | ${action} |${error ? " ERROR |" : ""} ${message}`)
    }
}