import { HandlerAgent } from '../agent/HandlerAgent';
import { AbstractAction } from './AbstractAction';

export class FunctionAction extends AbstractAction {
    constructor(
        private actionFunction: (arg0: HandlerAgent, ...args: any) => any
    ) {
        super();
    }

    static make(
        actionFunction: (arg0: HandlerAgent, ...args: any) => any
    ): FunctionAction {
        return new FunctionAction(actionFunction);
    }

    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        await this.actionFunction(handlerAgent, ...args);
    }
}
