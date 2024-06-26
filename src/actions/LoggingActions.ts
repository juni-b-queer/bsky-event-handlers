import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { AbstractMessageAction } from './AbstractMessageAction';
import { DebugLog } from '../utils/DebugLog';

export class LogMessageAction extends AbstractMessageAction {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any

    static make(): LogMessageAction {
        return new LogMessageAction();
    }
    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        console.log(message);
    }
}

export class LogInputTextAction extends AbstractMessageAction {
    constructor(private logText: string) {
        super();
    }

    static make(logText: string): LogInputTextAction {
        return new LogInputTextAction(logText);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        console.log(this.logText);
    }
}

export class DebugLogAction extends AbstractMessageAction {
    constructor(
        private action: string,
        private message: string,
        private level: string = 'info'
    ) {
        super();
    }

    static make(
        action: string,
        message: string,
        level: string = 'info'
    ): DebugLogAction {
        return new DebugLogAction(action, message, level);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        DebugLog.log(this.action, this.message, this.level);
    }
}
