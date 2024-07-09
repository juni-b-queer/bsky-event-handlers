import { AbstractValidator } from '../../validations/AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractMessageAction } from '../../actions/message-actions/AbstractMessageAction';
import { AbstractHandler } from '../AbstractHandler';
import { CreateSkeetMessage } from '../../types/JetstreamTypes';

// @ts-ignore
export class MessageHandler extends AbstractHandler {
    protected HANDLER_NAME: string = 'Message Handler';

    constructor(
        protected validators: Array<AbstractValidator>,
        protected actions: Array<AbstractMessageAction | MessageHandler>,
        public handlerAgent: HandlerAgent
    ) {
        super(validators, actions, handlerAgent);
        return this;
    }

    static getUriFromMessage(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): string {
        return handlerAgent.generateURIFromCreateMessage(message);
    }

    static getCidFromMessage(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): string {
        return message.cid;
    }

    static make(
        validators: Array<AbstractValidator>,
        actions: Array<AbstractMessageAction | MessageHandler>,
        handlerAgent: HandlerAgent
    ): MessageHandler {
        return new MessageHandler(validators, actions, handlerAgent);
    }
}