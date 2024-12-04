import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

export class RepostByUser extends AbstractMessageValidator {
    constructor(
        private userDid: string | undefined,
        private postUri: string | undefined
    ) {
        super();
    }

    static make(
        userDid: string | undefined = undefined,
        postUri: string | undefined = undefined
    ): RepostByUser {
        return new RepostByUser(userDid, postUri);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!message.commit.record?.subject) return false;
        if (typeof message.commit.record?.subject == 'string') return false;

        const uri = message.commit.record?.subject.uri;

        if (this.postUri) {
            if (uri != this.postUri) return false;
        }

        if (!this.userDid) {
            return handlerAgent.getDid === message.did;
        }
        return this.userDid === message.did;
    }
}

export class RepostOfUser extends AbstractMessageValidator {
    constructor(
        private userDid: string | undefined,
        private postUri: string | undefined
    ) {
        super();
    }

    static make(
        userDid: string | undefined = undefined,
        postUri: string | undefined = undefined
    ): RepostOfUser {
        return new RepostOfUser(userDid, postUri);
    }
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!message.commit.record?.subject) return false;
        if (typeof message.commit.record?.subject == 'string') return false;

        const uri = message.commit.record?.subject.uri;

        if (this.postUri) {
            if (uri != this.postUri) return false;
        }

        const postDid = handlerAgent.getDIDFromUri(uri);
        if (!this.userDid) {
            return handlerAgent.getDid === postDid;
        }
        return this.userDid === postDid;
    }
}

export class RepostOfPost extends AbstractMessageValidator {
    constructor(private postUri: string) {
        super();
    }

    static make(postUri: string): RepostOfPost {
        return new RepostOfPost(postUri);
    }
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (typeof message.commit.record?.subject == 'string') return false;
        if (!message.commit.record?.subject) return false;

        const uri = message.commit.record?.subject.uri;

        return uri == this.postUri;
    }
}
