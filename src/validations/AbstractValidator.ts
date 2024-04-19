import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { ValidatorInput } from "../types/ValidatorInput";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage, JetstreamMessage } from "../types/JetstreamTypes";

export abstract class AbstractValidator {
  constructor() {}

  getTextFromPost(message: CreateSkeetMessage): string {
    // @ts-ignore
    return message.record.text;
  }

  // @ts-ignore
  abstract async shouldTrigger(
    message: JetstreamMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean>;
}
