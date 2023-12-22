
import {flattenTextUpdated} from "../utils/text-utils";
import {AbstractValidator} from "./AbstractValidator";
import {ValidatorInput} from "../types/ValidatorInput";


export class InputIsCommandValidator extends AbstractValidator {
    constructor(private triggerKey: string) {
        super();
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let input = this.getTextFromPost(validatorInput.op)
        return input.startsWith(`!${this.triggerKey}`) || input.startsWith(`${this.triggerKey}!`)
    }

}

export class InputStartsWithValidator extends AbstractValidator {
    constructor(private triggerKey: string, private strict: boolean = false) {
        super();
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let input = this.getTextFromPost(validatorInput.op)
        if (this.strict) {
            return input.startsWith(this.triggerKey)
        }
        const flatText = flattenTextUpdated(this.triggerKey, input)
        return flatText.startsWith(this.triggerKey)
    }

}

export class InputContainsValidator extends AbstractValidator {
    constructor(private triggerKey: string) {
        super();
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let input = this.getTextFromPost(validatorInput.op)

        const flatText = flattenTextUpdated(this.triggerKey, input)
        return flatText.includes(this.triggerKey);
    }
}

export class InputEqualsValidator extends AbstractValidator {
    constructor(private triggerKey: string) {
        super();
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let input = this.getTextFromPost(validatorInput.op)

        return input === this.triggerKey;
    }
}