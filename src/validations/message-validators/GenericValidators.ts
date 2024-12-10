import { JetstreamEventCommit } from '../../types/JetstreamTypes';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractMessageValidator } from './AbstractMessageValidator';

export class ActionTakenByUserValidator extends AbstractMessageValidator {
    constructor(private userDid: string) {
        super();
    }

    static make(userDid: string): ActionTakenByUserValidator {
        return new ActionTakenByUserValidator(userDid);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        return this.userDid === message.did;
    }
}
