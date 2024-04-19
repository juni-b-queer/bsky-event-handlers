import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostDetails } from "../../types/PostDetails";
import { HandlerAgent } from "../../agent/HandlerAgent";
import { JetstreamMessage } from "../../types/JetstreamTypes";
import { DebugLog } from "../../utils/DebugLog";

export abstract class AbstractMessageAction {
  constructor() {}

  // @ts-ignore
  abstract async handle(
    handlerAgent: HandlerAgent,
    message: JetstreamMessage,
  ): Promise<any | void>;
}
