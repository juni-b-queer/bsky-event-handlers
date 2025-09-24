import { nowDateTime } from './time-utils';
import {GotifyClient} from "../integrations/gotify";

export class DebugLog {
    protected static gotifyClient: GotifyClient | undefined = undefined;

    static setGotifyClient(gotifyClient: GotifyClient | undefined = undefined) {
        DebugLog.gotifyClient = gotifyClient ?? DebugLog.generateDefaultGotifyClient();
    }

    static generateDefaultGotifyClient(): GotifyClient{
        const apiKey = process.env.GOTIFY_API_TOKEN
        const baseUrl = process.env.GOTIFY_SERVER_URL
        if(!apiKey || !baseUrl){
            throw new Error('Gotify API Token and Base URL are required to enable Gotify Debug Logging')
        }
        return new GotifyClient(apiKey, baseUrl)
    }

    static getGotifyClient(): GotifyClient | undefined {
        return DebugLog.gotifyClient;
    }
    static debug(action: string, message: string) {
        DebugLog.log(action, message, 'debug');
    }
    static info(action: string, message: string) {
        DebugLog.log(action, message, 'info');
    }

    static warn(action: string, message: string) {
        DebugLog.log(action, message, 'warn');
    }

    static error(action: string, message: string) {
        DebugLog.log(action, message, 'error');
    }

    static log(action: string, message: string, level: string = 'debug') {
        const debug: boolean = process.env.DEBUG_LOG_ACTIVE === 'true';
        const debugLevel: string = process.env.DEBUG_LOG_LEVEL ?? 'error';

        const debugLevels: { [level: string]: string[] } = {
            error: ['error'],
            warn: ['error', 'warn'],
            info: ['error', 'warn', 'info'],
            debug: ['error', 'warn', 'info', 'debug'],
        };

        if (debug && debugLevels[debugLevel].includes(level)) {
            console.log(
                `${nowDateTime()} | ${action} | ${level.toUpperCase()} | ${message}`
            );
        }

        const gotifyDebug: boolean = process.env.GOTIFY_DEBUG_LOG_ACTIVE === 'true';
        const gotifyDebugLevel: string = process.env.GOTIFY_DEBUG_LOG_LEVEL ?? 'error';

        if(gotifyDebug){
            if(!DebugLog.getGotifyClient()){
                DebugLog.setGotifyClient()
            }
            if(debugLevels[gotifyDebugLevel].includes(level)){
                DebugLog.getGotifyClient()?.sendMessage(`${level}: ${action}`, message)
            }
        }

    }
}
