import { nowDateTime } from './time-utils';

export class DebugLog {
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
    }
}
