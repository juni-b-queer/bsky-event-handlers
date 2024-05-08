import { AbstractValidator } from './AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamMessage } from '../types/JetstreamTypes';

/**
 * A validator in which you pass a single function that takes in the post
 * text, and returns a boolean
 */
export class SimpleFunctionValidator extends AbstractValidator {
    constructor(
        private triggerValidator: (
            arg0: JetstreamMessage,
            arg1: HandlerAgent
        ) => boolean | PromiseLike<boolean>
    ) {
        super();
    }

    static make(
        triggerValidator: (
            arg0: JetstreamMessage,
            arg1: HandlerAgent
        ) => boolean | PromiseLike<boolean>
    ): SimpleFunctionValidator {
        return new SimpleFunctionValidator(triggerValidator);
    }

    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        return await this.triggerValidator(message, handlerAgent);
    }
}

/**
 * A validator in which you pass in multiple other validators
 *  and if any of them should trigger, it will return true
 */
export class OrValidator extends AbstractValidator {
    constructor(private validators: Array<AbstractValidator>) {
        super();
    }

    static make(validators: Array<AbstractValidator>): OrValidator {
        return new OrValidator(validators);
    }

    async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        let willTrigger = false;
        for (const validator of this.validators) {
            const currentValidatorWillTrigger = await validator.shouldTrigger(
                message,
                handlerAgent
            );
            if (currentValidatorWillTrigger) {
                willTrigger = true;
            }
        }
        return willTrigger;
    }
}
