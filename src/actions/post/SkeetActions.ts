import { AbstractMessageAction } from '../AbstractMessageAction';
import {
    CreateSkeetMessage,
    JetstreamMessage,
    Reply,
    Subject,
} from '../../types/JetstreamTypes';
import { HandlerAgent } from '../../agent/HandlerAgent';
import * as repl from 'repl';

export class CreateSkeetAction extends AbstractMessageAction {
    constructor(private skeetText: string) {
        super();
    }

    static make(skeetText: string): CreateSkeetAction {
        return new CreateSkeetAction(skeetText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        await handlerAgent.createSkeet(this.skeetText);
    }
}

export class CreateSkeetWithGeneratedTextAction extends AbstractMessageAction {
    constructor(
        private textGenerator: (
            arg0: JetstreamMessage,
            arg1: HandlerAgent
        ) => string
    ) {
        super();
    }

    static make(
        textGenerator: (arg0: JetstreamMessage, arg1: HandlerAgent) => string
    ): CreateSkeetWithGeneratedTextAction {
        return new CreateSkeetWithGeneratedTextAction(textGenerator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        await handlerAgent.createSkeet(
            this.textGenerator(message, handlerAgent)
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
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        const reply: Reply = handlerAgent.generateReplyFromMessage(message);
        await handlerAgent.createSkeet(this.replyText, reply);
    }
}

export class ReplyToSkeetWithGeneratedTextAction extends AbstractMessageAction {
    constructor(
        private textGenerator: (
            arg0: CreateSkeetMessage,
            arg1: HandlerAgent
        ) => string
    ) {
        super();
    }

    static make(
        textGenerator: (arg0: CreateSkeetMessage, arg1: HandlerAgent) => string
    ): ReplyToSkeetWithGeneratedTextAction {
        return new ReplyToSkeetWithGeneratedTextAction(textGenerator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<any> {
        const reply: Reply = handlerAgent.generateReplyFromMessage(message);
        await handlerAgent.createSkeet(
            this.textGenerator(message, handlerAgent),
            reply
        );
    }
}
