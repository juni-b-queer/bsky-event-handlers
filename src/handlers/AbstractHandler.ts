import { AbstractValidator } from '../validations/AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';
import { AbstractAction } from '../actions/AbstractAction';
import { DebugLog } from '../utils/DebugLog';

export class AbstractHandler {
    protected HANDLER_NAME: string = 'Abstract Handler';

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
    async handle(
        handlerAgent: HandlerAgent | undefined,
        ...args: any
    ): Promise<void> {
        const shouldTrigger = await this.shouldTrigger(...args);
        if (shouldTrigger) {
            try {
                await this.runActions(...args);
            } catch (exception) {
                DebugLog.error(this.HANDLER_NAME, exception as string);
            }
        }
    }
}
