import { AbstractMessageValidator } from './AbstractMessageValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamEventCommit,
} from '../../types/JetstreamTypes';

export class TestMessageValidator extends AbstractMessageValidator {
    constructor(private shouldPass: boolean) {
        super();
    }

    static make(shouldPass: boolean): TestMessageValidator {
        return new TestMessageValidator(shouldPass);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        return this.shouldPass;
    }
}
