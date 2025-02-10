import { HandlerAgent } from '../agent/HandlerAgent';
import { DebugLog } from '../utils/DebugLog';
import { AbstractAction } from './AbstractAction';

export class LogInputTextAction extends AbstractAction {
    constructor(
        private logText: string | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        logText: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): LogInputTextAction {
        return new LogInputTextAction(logText);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const text: string = AbstractAction.getStringOrFunctionReturn(
            this.logText,
            handlerAgent,
            ...args
        );

        console.log(text);
    }
}

export class DebugLogAction extends AbstractAction {
    constructor(
        private action: string | ((arg0: HandlerAgent, ...args: any) => string),
        private message:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        private level: string = 'info'
    ) {
        super();
    }

    static make(
        action: string | ((arg0: HandlerAgent, ...args: any) => string),
        message: string | ((arg0: HandlerAgent, ...args: any) => string),
        level: string = 'info'
    ): DebugLogAction {
        return new DebugLogAction(action, message, level);
    }

    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        DebugLog.log(
            AbstractAction.getStringOrFunctionReturn(
                this.action,
                handlerAgent,
                ...args
            ),
            AbstractAction.getStringOrFunctionReturn(
                this.message,
                handlerAgent,
                ...args
            ),
            this.level
        );
    }
}
