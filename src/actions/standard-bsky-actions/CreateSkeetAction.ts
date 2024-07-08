import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';

export class CreateSkeetAction extends AbstractAction {
    constructor(protected skeetText: string) {
        super();
    }

    static make(skeetText: string): CreateSkeetAction {
        return new CreateSkeetAction(skeetText);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        await handlerAgent.createSkeet(this.skeetText);
    }
}
