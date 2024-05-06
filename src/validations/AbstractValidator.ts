import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage, JetstreamMessage } from "../types/JetstreamTypes";

export abstract class AbstractValidator {
  constructor() {}

  getTextFromPost(message: JetstreamMessage): string {
    const createSkeetMessage = message as CreateSkeetMessage;
    const text = createSkeetMessage.record.text;
    return <string>text;
  }

  // @ts-ignore
  abstract async shouldTrigger(
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean>;
}
