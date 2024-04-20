import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import { HandlerAgent } from "../agent/HandlerAgent";
import { JetstreamMessage } from "../types/JetstreamTypes";

/**
 * A validator in which you pass a single function that takes in the post
 * text, and returns a boolean
 */
export class SimpleFunctionValidator extends AbstractValidator {
  constructor(
    private triggerValidator: (
      arg0: JetstreamMessage,
    ) => boolean | PromiseLike<boolean>,
  ) {
    super();
  }

  async shouldTrigger(
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return await this.triggerValidator(message);
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
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    let willTrigger = false;
    for (const validator of this.validators) {
      const currentValidatorWillTrigger = await validator.shouldTrigger(
        message,
        handlerAgent,
      );
      if (currentValidatorWillTrigger) {
        willTrigger = true;
      }
    }
    return willTrigger;
  }
}

/**
 * @class NotValidator
 * @extends AbstractValidator
 * @description A class that represents a validator that negates the result of another validator.
 */
export class NotValidator extends AbstractValidator {
  constructor(private validator: AbstractValidator) {
    super();
  }

  async shouldTrigger(
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    let willTrigger = await this.validator.shouldTrigger(message, handlerAgent);
    return !willTrigger;
  }
}
