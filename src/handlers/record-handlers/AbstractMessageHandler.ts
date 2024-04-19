import { AbstractValidator } from "../../validations/AbstractValidator";
import { AbstractTriggerAction } from "../../actions/AbstractTriggerAction";
import { HandlerAgent } from "../../agent/HandlerAgent";
import { ValidatorInput } from "../../types/ValidatorInput";
import { JetstreamMessage } from "../../types/JetstreamTypes";
import { AbstractMessageAction } from "../../actions/v2/AbstractMessageAction";

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
      await action.handle(this.handlerAgent, message);
    }
  }

  //@ts-ignore
  abstract async handle(message: JetstreamMessage): Promise<void>;
}
