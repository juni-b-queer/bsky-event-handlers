import { AbstractMessageAction } from "../AbstractMessageAction";
import {
  CreateSkeetMessage,
  JetstreamMessage, Reply, Subject,
} from "../../types/JetstreamTypes";
import { HandlerAgent } from "../../agent/HandlerAgent";
import * as repl from "repl";

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

export class ReplyToSkeetAction extends AbstractMessageAction {
  constructor(private replyText: string) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<any> {
    let reply: Reply = handlerAgent.generateReplyFromMessage(message);
    await handlerAgent.createSkeet(this.replyText, reply);
  }
}
