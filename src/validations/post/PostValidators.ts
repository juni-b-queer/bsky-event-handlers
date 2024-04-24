import { AbstractValidator } from "../AbstractValidator";
import { HandlerAgent } from "../../agent/HandlerAgent";
import { CreateSkeetMessage } from "../../types/JetstreamTypes";

export class PostedByUserValidator extends AbstractValidator {
  constructor(private userDid: string) {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return (
      this.userDid === message.did && message.collection == "app.bsky.feed.post"
    );
  }
}

export class ReplyingToBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    if (!handlerAgent.hasPostReply(message)) {
      return false;
    }
    const replyingToDid = handlerAgent.getDIDFromUri(
      // @ts-ignore
      message.record.reply?.parent.uri,
    );

    return (
      handlerAgent.getDid === replyingToDid &&
      message.collection == "app.bsky.feed.post"
    );
  }
}

export class IsReplyValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return handlerAgent.hasPostReply(message);
  }
}
