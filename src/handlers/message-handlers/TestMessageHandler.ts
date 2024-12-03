import { MessageHandler } from './MessageHandler';
import { AbstractValidator } from '../../validations/AbstractValidator';
import { AbstractMessageAction } from '../../actions/message-actions/AbstractMessageAction';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    JetstreamEventCommit,
    JetstreamMessage,
} from '../../types/JetstreamTypes';
import { DebugLog } from '../../utils/DebugLog';

export class TestMessageHandler extends MessageHandler {
    constructor(
        validators: Array<AbstractValidator>,
        actions: Array<AbstractMessageAction | MessageHandler>,
        handlerAgent: HandlerAgent
    ) {
        super(validators, actions, handlerAgent);
        return this;
    }

    // TODO Update to use JetstreamEventCommit
    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamEventCommit
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
