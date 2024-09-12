import { HandlerAgent } from '../../../agent/HandlerAgent';
import { CreateSkeetMessage } from '../../../types/JetstreamTypes';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

export class PostedByUserValidator extends AbstractMessageValidator {
    constructor(
        private userDid:
            | string
            | ((handlerAgent: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        userDid: string | ((handlerAgent: HandlerAgent, ...args: any) => string)
    ): PostedByUserValidator {
        return new PostedByUserValidator(userDid);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        let generatedDid;
        if (typeof this.userDid == 'function') {
            generatedDid = this.userDid(handlerAgent, message);
        } else {
            generatedDid = this.userDid;
        }
        return (
            generatedDid === message.did &&
            message.collection == 'app.bsky.feed.post'
        );
    }
}

export class ReplyingToSkeetValidator extends AbstractMessageValidator {
    constructor(private skeetUri: string) {
        super();
    }

    static make(skeetUri: string): ReplyingToSkeetValidator {
        return new ReplyingToSkeetValidator(skeetUri);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        return message.record.reply?.parent.uri == this.skeetUri;
    }
}

export class ReplyingToBotValidator extends AbstractMessageValidator {
    constructor() {
        super();
    }

    static make(): ReplyingToBotValidator {
        return new ReplyingToBotValidator();
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        const replyingToDid = handlerAgent.getDIDFromUri(
            // @ts-ignore
            message.record.reply?.parent.uri
        );

        return (
            handlerAgent.getDid === replyingToDid &&
            message.collection == 'app.bsky.feed.post'
        );
    }
}

export class IsReplyValidator extends AbstractMessageValidator {
    constructor() {
        super();
    }

    static make(): IsReplyValidator {
        return new IsReplyValidator();
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        return handlerAgent.hasPostReply(message);
    }
}
