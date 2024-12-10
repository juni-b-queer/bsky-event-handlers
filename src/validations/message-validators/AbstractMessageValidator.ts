import { HandlerAgent } from '../../agent/HandlerAgent';
import { JetstreamEvent, NewSkeetRecord } from '../../types/JetstreamTypes';
import { AbstractValidator } from '../AbstractValidator';

export abstract class AbstractMessageValidator extends AbstractValidator {
    constructor() {
        super();
    }

    static make(...args: any): AbstractMessageValidator {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    getTextFromPost(message: JetstreamEvent): string {
        const createSkeetMessage = message?.commit?.record as NewSkeetRecord;
        const text = createSkeetMessage?.text;
        return <string>text;
    }

    // @ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEvent
    ): Promise<boolean>;

    // @ts-ignore
    async shouldTrigger(
        handlerAgent: HandlerAgent,
        message: JetstreamEvent
    ): Promise<boolean> {
        const valid: boolean = await this.handle(handlerAgent, message);
        return this.negate ? !valid : valid;
    }
}
