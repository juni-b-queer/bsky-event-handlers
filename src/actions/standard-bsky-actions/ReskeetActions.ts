import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';
import { getValueOrFunctionReturn } from '../../utils/type-or-function';

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
        const uri: string = getValueOrFunctionReturn(
            this.skeetUri,
            handlerAgent,
            ...args
        );
        const cid: string = getValueOrFunctionReturn(
            this.skeetCid,
            handlerAgent,
            ...args
        );

        await handlerAgent.reskeetSkeet(uri, cid);
    }
}

export class DeleteReskeetAction extends AbstractAction {
    constructor(
        protected skeetUri:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        skeetUri: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): DeleteReskeetAction {
        return new DeleteReskeetAction(skeetUri);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const uri: string = getValueOrFunctionReturn(
            this.skeetUri,
            handlerAgent,
            ...args
        );

        await handlerAgent.unreskeetSkeet(uri);
    }
}
