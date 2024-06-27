import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamMessage,
} from '../../types/JetstreamTypes';
import { AbstractValidator } from '../AbstractValidator';

export abstract class AbstractMessageValidator extends AbstractValidator {
    constructor() {
        super();
    }

    static make(...args: any): AbstractMessageValidator {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    getTextFromPost(message: JetstreamMessage): string {
        const createSkeetMessage = message as CreateSkeetMessage;
        const text = createSkeetMessage.record.text;
        return <string>text;
    }

    // @ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<boolean>;

    // @ts-ignore
    async shouldTrigger(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<boolean> {
        const valid: boolean = await this.handle(handlerAgent, message);
        return this.negate ? !valid : valid;
    }
}
