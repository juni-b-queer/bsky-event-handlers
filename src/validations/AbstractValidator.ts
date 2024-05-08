import { RepoOp } from '@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos';
import { HandlerAgent } from '../agent/HandlerAgent';
import { CreateSkeetMessage, JetstreamMessage } from '../types/JetstreamTypes';

export abstract class AbstractValidator {

    private negate: boolean = false;
    constructor() {}

    static make(...args: any): AbstractValidator {
        throw new Error("Method Not Implemented! Use constructor.")
    }

    not(): AbstractValidator {
        this.negate = true;
        return this;
    }

    getTextFromPost(message: JetstreamMessage): string {
        const createSkeetMessage = message as CreateSkeetMessage;
        const text = createSkeetMessage.record.text;
        return <string>text;
    }

    // @ts-ignore
    abstract async handle(message: JetstreamMessage, handlerAgent: HandlerAgent): Promise<boolean>;

    // @ts-ignore
    async shouldTrigger(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean>{
        const valid: boolean = await this.handle(message, handlerAgent)
        return this.negate ? !valid : valid;
    }
}
