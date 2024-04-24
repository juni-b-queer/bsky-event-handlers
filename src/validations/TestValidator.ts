import { AbstractValidator } from "./AbstractValidator";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage } from "../types/JetstreamTypes";

export class TestValidator extends AbstractValidator {
  constructor(private shouldPass: boolean) {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return this.shouldPass;
  }
}
