import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';

export class CreateSkeetAction extends AbstractAction {
    constructor(
        protected skeetText:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        skeetText: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CreateSkeetAction {
        return new CreateSkeetAction(skeetText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const text: string = AbstractAction.getStringOrFunctionReturn(
            this.skeetText,
            handlerAgent,
            ...args
        );

        await handlerAgent.createSkeet(text);
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
