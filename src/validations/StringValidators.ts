import { flattenTextUpdated } from "../utils/text-utils";
import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import {HandlerAgent} from "../agent/HandlerAgent";

export class InputIsCommandValidator extends AbstractValidator {
  constructor(
    private triggerKey: string,
    private strict: boolean = true,
  ) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    if (this.strict) {
      const input = this.getTextFromPost(validatorInput.op);
      return (
        input.startsWith(`!${this.triggerKey}`) ||
        input.startsWith(`${this.triggerKey}!`)
      );
    } else {
      const input = this.getTextFromPost(validatorInput.op).toLowerCase();
      const lowerCaseTriggerKey = this.triggerKey.toLowerCase();
      return (
        input.startsWith(`!${lowerCaseTriggerKey}`) ||
        input.startsWith(`${lowerCaseTriggerKey}!`)
      );
    }
  }
}

export class InputStartsWithValidator extends AbstractValidator {
  constructor(
    private triggerKey: string,
    private strict: boolean = false,
  ) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    const input = this.getTextFromPost(validatorInput.op);
    if (this.strict) {
      return input.startsWith(this.triggerKey);
    }
    const flatText = flattenTextUpdated(this.triggerKey, input);
    return flatText.startsWith(this.triggerKey);
  }
}

export class InputContainsValidator extends AbstractValidator {
  constructor(private triggerKey: string) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    const input = this.getTextFromPost(validatorInput.op);

    const flatText = flattenTextUpdated(this.triggerKey, input);
    return flatText.includes(this.triggerKey);
  }
}

export class InputEqualsValidator extends AbstractValidator {
  constructor(private triggerKey: string) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    const input = this.getTextFromPost(validatorInput.op);

    return input === this.triggerKey;
  }
}
