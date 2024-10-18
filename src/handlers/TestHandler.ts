import { AbstractValidator } from '../validations/AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';
import { DebugLog } from '../utils/DebugLog';
import { MessageHandler } from './message-handlers/MessageHandler';
import { AbstractHandler } from './AbstractHandler';
import { AbstractAction } from '../actions/AbstractAction';

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
