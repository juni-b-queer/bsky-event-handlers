import { AbstractMessageAction } from '../AbstractMessageAction';
import {
    CreateSkeetMessage,
    JetstreamMessage,
    Reply,
} from '../../../types/JetstreamTypes';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { CreateSkeetAction } from '../../standard-bsky-actions/SkeetActions';

export class CreateSkeetMessageAction extends AbstractMessageAction {
    constructor(private skeetText: string) {
        super();
    }

    static make(skeetText: string): CreateSkeetMessageAction {
        return new CreateSkeetMessageAction(skeetText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<any> {
        await CreateSkeetAction.make(this.skeetText).handle(handlerAgent);
    }
}

export class CreateSkeetWithGeneratedTextAction extends AbstractMessageAction {
    constructor(
        private textGenerator: (
            arg0: HandlerAgent,
            arg1: JetstreamMessage
        ) => string
    ) {
        super();
    }

    static make(
        textGenerator: (arg0: HandlerAgent, arg1: JetstreamMessage) => string
    ): CreateSkeetWithGeneratedTextAction {
        return new CreateSkeetWithGeneratedTextAction(textGenerator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<any> {
        await handlerAgent.createSkeet(
            this.textGenerator(handlerAgent, message)
        );
    }
}

export class ReplyToSkeetAction extends AbstractMessageAction {
    constructor(private replyText: string) {
        super();
    }

    static make(replyText: string): ReplyToSkeetAction {
        return new ReplyToSkeetAction(replyText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<any> {
        const reply: Reply = handlerAgent.generateReplyFromMessage(message);
        await handlerAgent.createSkeet(this.replyText, reply);
    }
}

export class ReplyToSkeetWithGeneratedTextAction extends AbstractMessageAction {
    constructor(
        private textGenerator: (
            arg0: HandlerAgent,
            arg1: CreateSkeetMessage
        ) => string
    ) {
        super();
    }

    static make(
        textGenerator: (arg0: HandlerAgent, arg1: CreateSkeetMessage) => string
    ): ReplyToSkeetWithGeneratedTextAction {
        return new ReplyToSkeetWithGeneratedTextAction(textGenerator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<any> {
        const reply: Reply = handlerAgent.generateReplyFromMessage(message);
        await handlerAgent.createSkeet(
            this.textGenerator(handlerAgent, message),
            reply
        );
    }
}