import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractMessageAction } from './AbstractMessageAction';
import { JetstreamMessage } from '../../types/JetstreamTypes';

export class FunctionAction extends AbstractMessageAction {
    constructor(
        private actionFunction: (
            arg0: HandlerAgent,
            arg1: JetstreamMessage
        ) => any
    ) {
        super();
    }

    static make(
        actionFunction: (arg0: HandlerAgent, arg1: JetstreamMessage) => any
    ): FunctionAction {
        return new FunctionAction(actionFunction);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<any> {
        await this.actionFunction(handlerAgent, message);
    }
}
