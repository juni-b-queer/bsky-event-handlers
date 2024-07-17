import { HandlerAgent } from '../agent/HandlerAgent';
import { DebugLog } from '../utils/DebugLog';

export abstract class AbstractAction {
    constructor() {}

    static make(...args: any): AbstractAction {
        throw new Error('Method not implemented! Use constructor!');
    }

    static getStringOrFunctionReturn(
        stringOrFunction:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        handlerAgent: HandlerAgent,
        ...args: any
    ): string {
        if (typeof stringOrFunction == 'function') {
            return stringOrFunction(handlerAgent, ...args);
        } else {
            return stringOrFunction;
        }
    }

    // @ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent,
        ...args: any
    ): Promise<any | void>;
}

export class TestAction extends AbstractAction {
    async handle(handlerAgent: HandlerAgent): Promise<any | void> {
        DebugLog.info('Working', 'working');
    }
}
