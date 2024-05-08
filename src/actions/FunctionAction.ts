import { HandlerAgent } from '../agent/HandlerAgent';
import { AbstractMessageAction } from './AbstractMessageAction';
import { JetstreamMessage } from '../types/JetstreamTypes';

export class FunctionAction extends AbstractMessageAction {
    constructor(
        private actionFunction: (
            arg0: JetstreamMessage,
            arg1: HandlerAgent
        ) => any
    ) {
        super();
    }

    static make(
        actionFunction: (arg0: JetstreamMessage, arg1: HandlerAgent) => any
    ): FunctionAction {
        return new FunctionAction(actionFunction);
    }

    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        await this.actionFunction(message, handlerAgent);
    }
}
