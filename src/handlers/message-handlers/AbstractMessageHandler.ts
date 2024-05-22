import { AbstractValidator } from '../../validations/AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamMessage,
} from '../../types/JetstreamTypes';
import { AbstractMessageAction } from '../../actions/message-actions/AbstractMessageAction';
import { DebugLog } from '../../utils/DebugLog';

export abstract class AbstractMessageHandler {
    constructor(
        private validators: Array<AbstractValidator>,
        private actions: Array<AbstractMessageAction | AbstractMessageHandler>,
        public handlerAgent: HandlerAgent
    ) {}

    static make(...args: any): AbstractMessageHandler {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    async shouldTrigger(message: JetstreamMessage): Promise<boolean> {
        const willTrigger = true;
        for (const validator of this.validators) {
            const response = await validator.shouldTrigger(
                this.handlerAgent,
                message
            );
            if (!response) {
                return false;
            }
        }
        return willTrigger;
    }

    async runActions(message: JetstreamMessage) {
        for (const action of this.actions) {
            await action.handle(this.handlerAgent, message);
        }
    }

    //@ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamMessage
    ): Promise<void>;
}

// @ts-ignore
export class MessageHandler extends AbstractMessageHandler {
    constructor(
        private validators: Array<AbstractValidator>,
        private actions: Array<AbstractMessageAction | MessageHandler>,
        public handlerAgent: HandlerAgent
    ) {
        super(validators, actions, handlerAgent);
        return this;
    }

    static make(
        validators: Array<AbstractValidator>,
        actions: Array<AbstractMessageAction | MessageHandler>,
        handlerAgent: HandlerAgent
    ): MessageHandler {
        return new MessageHandler(validators, actions, handlerAgent);
    }

    // I'm ignoring the handler agent here, this is so that when a root handler
    //  calls handler on a sub handler, the subhandler will use it's own assigned
    //  agent. This allows us to use separate agents in subhandlers
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
