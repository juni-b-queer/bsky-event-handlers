import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';
import { DebugLog } from '../../utils/DebugLog';

export class CreateLikeAction extends AbstractAction {
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
    ): CreateLikeAction {
        return new CreateLikeAction(skeetUri, skeetCid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.skeetUri == 'function') {
            this.skeetUri = this.skeetUri(handlerAgent, ...args);
        }
        if (typeof this.skeetCid == 'function') {
            this.skeetCid = this.skeetCid(handlerAgent, ...args);
        }
        DebugLog.warn('LIKE', `uri: ${this.skeetUri}, cid: ${this.skeetCid}`);
        await handlerAgent.likeSkeet(this.skeetUri, this.skeetCid);
    }
}

export class DeleteLikeAction extends AbstractAction {
    constructor(
        protected skeetUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        skeetUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): DeleteLikeAction {
        return new DeleteLikeAction(skeetUri);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.skeetUri == 'function') {
            this.skeetUri = this.skeetUri(handlerAgent, ...args);
        }
        await handlerAgent.unlikeSkeet(this.skeetUri);
    }
}
