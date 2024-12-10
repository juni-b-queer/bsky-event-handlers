import { HandlerAgent } from '../../../agent/HandlerAgent';
import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
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
        message: JetstreamEventCommit
    ): Promise<boolean> {
        return (
            this.userDid === message.did &&
            message.commit.collection == 'app.bsky.feed.post'
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
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!message.commit.record?.reply) return false;
        const replyingToDid = handlerAgent.getDIDFromUri(
            message.commit.record.reply?.parent.uri
        );

        return (
            handlerAgent.getDid === replyingToDid &&
            message.commit.collection == 'app.bsky.feed.post'
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
        message: JetstreamEventCommit
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
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!message.commit.record) return false;
        const createdAt = new Date(message?.commit.record?.createdAt);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        return now.getTime() - createdAt.getTime() < oneDay;
    }
}
