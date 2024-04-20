import { AbstractMessageHandler } from "../AbstractMessageHandler";
import { AbstractMessageAction } from "../../../actions/AbstractMessageAction";
import {
  CreateSkeetMessage,
  JetstreamMessage,
} from "../../../types/JetstreamTypes";
import { AbstractValidator } from "../../../validations/AbstractValidator";
import { HandlerAgent } from "../../../agent/HandlerAgent";
import { DebugLog } from "../../../utils/DebugLog";

// @ts-ignore
export class CreateSkeetHandler extends AbstractMessageHandler {
  constructor(
    validators: Array<AbstractValidator>,
    actions: Array<AbstractMessageAction>,
    handlerAgent: HandlerAgent,
  ) {
    super(validators, actions, handlerAgent);
    return this;
  }

  async handle(message: CreateSkeetMessage): Promise<void> {
    const shouldTrigger = await this.shouldTrigger(message);
    console.log(shouldTrigger);
    if (shouldTrigger) {
      try {
        await this.runActions(message);
      } catch (exception) {
        DebugLog.error("Skeet Handler", exception as string);
      }
    }
  }
}
