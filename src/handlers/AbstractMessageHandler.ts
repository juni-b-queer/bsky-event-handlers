import { AbstractValidator } from "../validations/AbstractValidator";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage, JetstreamMessage } from "../types/JetstreamTypes";
import { AbstractMessageAction } from "../actions/AbstractMessageAction";
import { DebugLog } from "../utils/DebugLog";

export abstract class AbstractMessageHandler {
  constructor(
    private validators: Array<AbstractValidator>,
    private actions: Array<AbstractMessageAction>,
    public handlerAgent: HandlerAgent,
  ) {}

  async shouldTrigger(message: JetstreamMessage): Promise<boolean> {
    const willTrigger = true;
    for (const validator of this.validators) {
      const response = await validator.shouldTrigger(
        message,
        this.handlerAgent,
      );
      if (!response) {
        return false;
      }
    }
    return willTrigger;
  }

  async runActions(message: JetstreamMessage) {
    for (const action of this.actions) {
      await action.handle(message, this.handlerAgent);
    }
  }

  //@ts-ignore
  abstract async handle(message: JetstreamMessage): Promise<void>;
}

export class MessageHandler extends AbstractMessageHandler {
  constructor(
    validators: Array<AbstractValidator>,
    actions: Array<AbstractMessageAction>,
    handlerAgent: HandlerAgent,
  ) {
    super(validators, actions, handlerAgent);
    return this;
  }

  async handle(message: JetstreamMessage): Promise<void> {
    const shouldTrigger = await this.shouldTrigger(message);
    if (shouldTrigger) {
      try {
        await this.runActions(message);
      } catch (exception) {
        DebugLog.error("Message Handler", exception as string);
      }
    }
  }
}
