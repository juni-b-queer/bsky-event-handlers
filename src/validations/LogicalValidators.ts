import { AbstractValidator } from './AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';

/**
 * A validator in which you pass a single function that takes in the post
 * text, and returns a boolean
 */
export class SimpleFunctionValidator extends AbstractValidator {
    constructor(
        private triggerValidator: (
            arg0: HandlerAgent | undefined,
            ...args: any
        ) => boolean | PromiseLike<boolean>
    ) {
        super();
    }

    static make(
        triggerValidator: (
            arg0: HandlerAgent | undefined,
            ...args: any
        ) => boolean | PromiseLike<boolean>
    ): SimpleFunctionValidator {
        return new SimpleFunctionValidator(triggerValidator);
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        ...args: any
    ): Promise<boolean> {
        return await this.triggerValidator(handlerAgent, ...args);
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

    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<boolean> {
        let willTrigger = false;
        for (const validator of this.validators) {
            const currentValidatorWillTrigger = await validator.shouldTrigger(
                handlerAgent,
                ...args
            );
            if (currentValidatorWillTrigger) {
                willTrigger = true;
            }
        }
        return willTrigger;
    }
}
