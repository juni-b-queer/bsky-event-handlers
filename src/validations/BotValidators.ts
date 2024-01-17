import {ValidatorInput} from "../types/ValidatorInput";
import {isBadBotResponse, isGoodBotResponse} from "../utils/text-utils";
import {AbstractValidator} from "./AbstractValidator";

export class IsGoodBotValidator extends AbstractValidator {

    constructor() {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        return isGoodBotResponse(this.getTextFromPost(validatorInput.op));
    }

}

export class IsBadBotValidator extends AbstractValidator {

    constructor() {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        return isBadBotResponse(this.getTextFromPost(validatorInput.op));
    }

}