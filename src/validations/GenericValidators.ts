import { AbstractValidator } from './AbstractValidator';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { HandlerAgent } from '../agent/HandlerAgent';

export class ActionTakenByUserValidator extends AbstractValidator {
    constructor(private userDid: string) {
        super();
    }

    static make(userDid: string): ActionTakenByUserValidator {
        return new ActionTakenByUserValidator(userDid);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<boolean> {
        return this.userDid === message.did;
    }
}
