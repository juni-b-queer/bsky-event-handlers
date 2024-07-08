import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';

export class CreateReskeetAction extends AbstractAction {
    constructor(
        protected skeetUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected skeetCid:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        skeetUri: string | ((arg0: HandlerAgent, ...args: any) => string),
        skeetCid: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CreateReskeetAction {
        return new CreateReskeetAction(skeetUri, skeetCid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.skeetUri == 'function') {
            this.skeetUri = this.skeetUri(handlerAgent, ...args);
        }
        if (typeof this.skeetCid == 'function') {
            this.skeetCid = this.skeetCid(handlerAgent, ...args);
        }
        await handlerAgent.reskeetSkeet(this.skeetUri, this.skeetCid);
    }
}

export class DeleteReskeetAction extends AbstractAction {
    constructor(
        protected reskeetUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        likeUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): DeleteReskeetAction {
        return new DeleteReskeetAction(likeUri);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.reskeetUri == 'function') {
            this.reskeetUri = this.reskeetUri(handlerAgent, ...args);
        }
        await handlerAgent.unreskeetSkeet(this.reskeetUri);
    }
}
