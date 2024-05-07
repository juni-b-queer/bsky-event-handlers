import { AbstractValidator } from './AbstractValidator';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { HandlerAgent } from '../agent/HandlerAgent';

export class ActionTakenByUserValidator extends AbstractValidator {
    constructor(private userDid: string) {
        super();
    }

    async shouldTrigger(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        return this.userDid === message.did;
    }
}
