import { AbstractValidator } from './AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';
import { CreateSkeetMessage } from '../types/JetstreamTypes';

export class TestValidator extends AbstractValidator {
    constructor(private shouldPass: boolean) {
        super();
    }

    static make(shouldPass: boolean): TestValidator {
        return new TestValidator(shouldPass);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: CreateSkeetMessage
    ): Promise<boolean> {
        return this.shouldPass;
    }
}
