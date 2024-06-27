import { AbstractValidator } from '../../validations/AbstractValidator';
import { AbstractMessageAction } from '../../actions/message-actions/AbstractMessageAction';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { JetstreamMessage } from '../../types/JetstreamTypes';
import { AbstractAction } from '../../actions/AbstractAction';

export abstract class AbstractHandler {
    constructor(
        protected validators: Array<AbstractValidator>,
        protected actions: Array<AbstractAction | AbstractHandler>,
        public handlerAgent: HandlerAgent
    ) {}

    static make(...args: any): AbstractHandler {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    async shouldTrigger(...args: any): Promise<boolean> {
        const willTrigger = true;
        for (const validator of this.validators) {
            const response = await validator.shouldTrigger(
                this.handlerAgent,
                ...args
            );
            if (!response) {
                return false;
            }
        }
        return willTrigger;
    }

    async runActions(...args: any) {
        for (const action of this.actions) {
            await action.handle(this.handlerAgent, ...args);
        }
    }

    //@ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent | undefined,
        ...args: any
    ): Promise<void>;
}
