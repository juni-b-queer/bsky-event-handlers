import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

export class NewFollowerForUserValidator extends AbstractMessageValidator {
    constructor(private userDid: string | undefined) {
        super();
    }

    static make(
        userDid: string | undefined = undefined
    ): NewFollowerForUserValidator {
        return new NewFollowerForUserValidator(userDid);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!this.userDid) {
            return handlerAgent.getDid === message?.commit?.record?.subject;
        }
        return this.userDid === message?.commit?.record?.subject;
    }
}

export class NewFollowFromUserValidator extends AbstractMessageValidator {
    constructor(private userDid: string | undefined) {
        super();
    }

    static make(
        userDid: string | undefined = undefined
    ): NewFollowFromUserValidator {
        return new NewFollowFromUserValidator(userDid);
    }
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!this.userDid) {
            return handlerAgent.getDid === message.did;
        }
        return this.userDid === message.did;
    }
}

/**
 * Deprecated name. NewFollowFromUserValidator is named better to go with the other Follow Validator
 */
export class UserFollowedValidator extends NewFollowFromUserValidator {}
