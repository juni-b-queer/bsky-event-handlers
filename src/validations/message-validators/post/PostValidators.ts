import { HandlerAgent } from '../../../agent/HandlerAgent';
import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
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
        message: JetstreamEventCommit
    ): Promise<boolean> {
        let generatedDid;
        if (typeof this.userDid == 'function') {
            generatedDid = this.userDid(handlerAgent, message);
        } else {
            generatedDid = this.userDid;
        }
        return (
            generatedDid === message.did &&
            message.commit.collection == 'app.bsky.feed.post'
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
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        return message.commit?.record?.reply?.parent.uri == this.skeetUri;
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
