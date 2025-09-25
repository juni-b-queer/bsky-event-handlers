import { JetstreamEventCommit } from '../../types/JetstreamTypes';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractMessageValidator } from './AbstractMessageValidator';
import { getValueOrFunctionReturn } from '../../utils/type-or-function';

// TODO Tests and documentation
export class CanDmUserValidator extends AbstractMessageValidator {
    constructor(
        protected userDID:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        userDID: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CanDmUserValidator {
        return new CanDmUserValidator(userDID);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const did: string = getValueOrFunctionReturn(
            this.userDID,
            handlerAgent,
            message
        );
        return await handlerAgent.getCanDmUser(did);
    }
}
