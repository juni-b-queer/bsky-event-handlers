import { AbstractValidator } from '../../validations/AbstractValidator';
import { AbstractMessageAction } from '../../actions/message-actions/AbstractMessageAction';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { JetstreamMessage } from '../../types/JetstreamTypes';
import { DebugLog } from '../../utils/DebugLog';
import {
    AbstractMessageHandler,
    MessageHandler,
} from './AbstractMessageHandler';
import { AbstractHandler } from './AbstractHandler';
import { AbstractAction } from '../../actions/AbstractAction';

export class TestHandler extends AbstractHandler {
    constructor(
        validators: Array<AbstractValidator>,
        actions: Array<AbstractAction | MessageHandler>,
        handlerAgent: HandlerAgent
    ) {
        super(validators, actions, handlerAgent);
        return this;
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        ...args: any
    ): Promise<void> {
        const shouldTrigger = await this.shouldTrigger(...args);
        if (shouldTrigger) {
            try {
                await this.runActions(...args);
            } catch (exception) {
                DebugLog.error('Message Handler', exception as string);
            }
        }
    }
}

export class TestMessageHandler extends AbstractMessageHandler {
    constructor(
        validators: Array<AbstractValidator>,
        actions: Array<AbstractMessageAction | MessageHandler>,
        handlerAgent: HandlerAgent
    ) {
        super(validators, actions, handlerAgent);
        return this;
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamMessage
    ): Promise<void> {
        const shouldTrigger = await this.shouldTrigger(message);
        if (shouldTrigger) {
            try {
                await this.runActions(message);
            } catch (exception) {
                DebugLog.error('Message Handler', exception as string);
            }
        }
    }
}
