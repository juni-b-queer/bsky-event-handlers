import { HandlerAgent } from '../../../agent/HandlerAgent';
import { CreateSkeetMessage } from '../../../types/JetstreamTypes';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

export class PostedByUserValidator extends AbstractMessageValidator {
    constructor(private userDid: string) {
        super();
    }

    static make(userDid: string): PostedByUserValidator {
        return new PostedByUserValidator(userDid);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        return (
            this.userDid === message.did &&
            message.collection == 'app.bsky.feed.post'
        );
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

export class IsNewPost extends AbstractMessageValidator {
    constructor() {
        super();
    }

    static make(): IsNewPost {
        return new IsNewPost();
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        const createdAt = new Date(message.record.createdAt);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        return now.getTime() - createdAt.getTime() < oneDay;
    }
}
