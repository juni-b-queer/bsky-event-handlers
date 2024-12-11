import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';
import { JetstreamReply, JetstreamSubject } from '../../types/JetstreamTypes';

export class CreateSkeetAction extends AbstractAction {
    constructor(
        protected skeetText:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected skeetReply:
            | JetstreamReply
            | ((arg0: HandlerAgent, ...args: any) => JetstreamReply)
            | undefined = undefined,
        protected quoteSkeet:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ) {
        super();
    }

    static make(
        skeetText: string | ((arg0: HandlerAgent, ...args: any) => string),
        skeetReply:
            | JetstreamReply
            | ((arg0: HandlerAgent, ...args: any) => JetstreamReply)
            | undefined = undefined,
        quoteSkeet:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ): CreateSkeetAction {
        return new CreateSkeetAction(skeetText, skeetReply, quoteSkeet);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const text: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetText,
            handlerAgent,
            ...args
        );
        let reply = undefined;
        if (this.skeetReply !== undefined) {
            if (typeof this.skeetReply == 'function') {
                reply = this.skeetReply(handlerAgent, ...args);
            } else {
                reply = this.skeetReply;
            }
        }

        let quoteRecord = undefined;
        if (this.quoteSkeet !== undefined) {
            if (typeof this.quoteSkeet == 'function') {
                quoteRecord = this.quoteSkeet(handlerAgent, ...args);
            } else {
                quoteRecord = this.quoteSkeet;
            }
        }

        await handlerAgent.createSkeet(text, reply, quoteRecord);
    }
}

export class DeleteSkeetAction extends AbstractAction {
    constructor(
        protected skeetUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        skeetUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): DeleteSkeetAction {
        return new DeleteSkeetAction(skeetUri);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const uri: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetUri,
            handlerAgent,
            ...args
        );

        await handlerAgent.deleteSkeet(uri);
    }
}
