import { JetstreamEventCommit } from '../../types/JetstreamTypes';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractMessageValidator } from './AbstractMessageValidator';
import { getStringOrFunctionReturn } from '../../utils/type-or-function';

export class CanReplyToThreadValidator extends AbstractMessageValidator {
    constructor(
        protected rootUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        rootUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CanReplyToThreadValidator {
        return new CanReplyToThreadValidator(rootUri);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const uri: string = getStringOrFunctionReturn(
            this.rootUri,
            handlerAgent,
            message
        );
        return await handlerAgent.getAgentCanReply(uri);
    }
}

// TODO Tests and documentation
export class CanQuoteThreadValidator extends AbstractMessageValidator {
    constructor(
        protected rootUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        rootUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CanQuoteThreadValidator {
        return new CanQuoteThreadValidator(rootUri);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const uri: string = getStringOrFunctionReturn(
            this.rootUri,
            handlerAgent,
            message
        );
        return await handlerAgent.getAgentCanQuote(uri);
    }
}
