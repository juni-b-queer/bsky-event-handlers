import { AbstractMessageAction } from "../AbstractMessageAction";
import {
  CreateSkeetMessage,
  JetstreamMessage,
} from "../../types/JetstreamTypes";
import { HandlerAgent } from "../../agent/HandlerAgent";

export class CreateSkeetAction extends AbstractMessageAction {
  constructor(private skeetText: string) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<any> {
    await handlerAgent.createSkeet(this.skeetText);
  }
}

// TODO handle reply!
export class ReplyToSkeetAction extends AbstractMessageAction {
  constructor(private replyText: string) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<any> {
    await handlerAgent.createSkeet(this.replyText);
  }
}
