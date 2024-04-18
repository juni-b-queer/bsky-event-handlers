import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import { HandlerAgent } from "../agent/HandlerAgent";

/**
 * A validator in which you pass a single function that takes in the post
 * text, and returns a boolean
 */
export class SimpleFunctionValidator extends AbstractValidator {
  constructor(
    private triggerValidator: (
      arg0: ValidatorInput,
    ) => boolean | PromiseLike<boolean>,
  ) {
    super();
  }

  async shouldTrigger(
    validatorInput: ValidatorInput,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return await this.triggerValidator(validatorInput);
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

  async shouldTrigger(
    validatorInput: ValidatorInput,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    let willTrigger = false;
    for (const validator of this.validators) {
      const currentValidatorWillTrigger = await validator.shouldTrigger(
        validatorInput,
        handlerAgent,
      );
      if (currentValidatorWillTrigger) {
        willTrigger = true;
      }
    }
    return willTrigger;
  }
}
