import { CreateMessage, JetstreamMessage } from '../../types/JetstreamTypes';
import { AbstractValidator } from '../AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';

export class NewFollowerForUserValidator extends AbstractValidator {
    constructor(private userDid: string | undefined) {
        super();
    }

    static make(userDid: string | undefined = undefined): NewFollowerForUserValidator {
        return new NewFollowerForUserValidator(userDid);
    }

    async handle(
        message: CreateMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        if (!this.userDid) {
            return handlerAgent.getDid === message.record.subject;
        }
        return this.userDid === message.record.subject;
    }
}

export class NewFollowFromUserValidator extends AbstractValidator {
    constructor(private userDid: string | undefined) {
        super();
    }

    static make(userDid: string | undefined = undefined): NewFollowFromUserValidator {
        return new NewFollowFromUserValidator(userDid);
    }
    async handle(
        message: CreateMessage,
        handlerAgent: HandlerAgent
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
