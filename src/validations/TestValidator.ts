import { AbstractValidator } from './AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';

export class TestValidator extends AbstractValidator {
    constructor(private shouldPass: boolean) {
        super();
    }

    static make(shouldPass: boolean): TestValidator {
        return new TestValidator(shouldPass);
    }

    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<boolean> {
        return this.shouldPass;
    }
}
