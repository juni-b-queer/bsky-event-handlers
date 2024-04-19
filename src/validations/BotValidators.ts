import { ValidatorInput } from "../types/ValidatorInput";
import { isBadBotResponse, isGoodBotResponse } from "../utils/text-utils";
import { AbstractValidator } from "./AbstractValidator";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage, JetstreamMessage } from "../types/JetstreamTypes";

export class IsGoodBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return isGoodBotResponse(this.getTextFromPost(message));
  }
}

export class IsBadBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return isBadBotResponse(this.getTextFromPost(message));
  }
}
