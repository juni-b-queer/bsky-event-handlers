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
        const uri: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetUri,
            handlerAgent,
            ...args
        );
        const cid: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetCid,
            handlerAgent,
            ...args
        );

        DebugLog.warn('LIKE', `uri: ${uri}, cid: ${cid}`);
        await handlerAgent.likeSkeet(uri, cid);
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
        const uri: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetUri,
            handlerAgent,
            ...args
        );
        await handlerAgent.unlikeSkeet(uri);
    }
}
