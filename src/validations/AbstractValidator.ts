import { HandlerAgent } from '../agent/HandlerAgent';

export abstract class AbstractValidator {
    protected negate: boolean = false;
    constructor() {}

    static make(...args: any): AbstractValidator {
        throw new Error('Method Not Implemented! Use constructor.');
    }

    not(): this {
        this.negate = true;
        return this;
    }

    // @ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent,
        ...args: any
    ): Promise<boolean>;

    // @ts-ignore
    async shouldTrigger(
        handlerAgent: HandlerAgent,
        ...args: any
    ): Promise<boolean> {
        const valid: boolean = await this.handle(handlerAgent, ...args);
        return this.negate ? !valid : valid;
    }
}
