import { HandlerAgent } from '../agent/HandlerAgent';
import { DebugLog } from '../utils/DebugLog';
import { AbstractAction } from './AbstractAction';

export class LogInputTextAction extends AbstractAction {
    constructor(private logText: string) {
        super();
    }

    static make(logText: string): LogInputTextAction {
        return new LogInputTextAction(logText);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        console.log(this.logText);
    }
}

export class DebugLogAction extends AbstractAction {
    constructor(
        private action: string,
        private message: string,
        private level: string = 'info'
    ) {
        super();
    }

    // TODO add a stringOrCallable interface, and function to return string or called function
    static make(
        action: string,
        message: string,
        level: string = 'info'
    ): DebugLogAction {
        return new DebugLogAction(action, message, level);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        DebugLog.log(this.action, this.message, this.level);
    }
}
