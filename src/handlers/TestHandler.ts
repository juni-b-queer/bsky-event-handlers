import { AbstractValidator } from '../validations/AbstractValidator';
import { AbstractMessageAction } from '../actions/AbstractMessageAction';
import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { DebugLog } from '../utils/DebugLog';
import {
    AbstractMessageHandler,
    MessageHandler,
} from './AbstractMessageHandler';

export class TestHandler extends AbstractMessageHandler {
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
