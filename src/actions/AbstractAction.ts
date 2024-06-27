import { HandlerAgent } from '../agent/HandlerAgent';
import { DebugLog } from '../utils/DebugLog';

export abstract class AbstractAction {
    constructor() {}

    static make(...args: any): AbstractAction {
        throw new Error('Method not implemented! Use constructor!');
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
