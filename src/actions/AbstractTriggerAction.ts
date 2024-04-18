import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostDetails } from "../types/PostDetails";
import { HandlerAgent } from "../agent/HandlerAgent";

export abstract class AbstractTriggerAction {
  constructor() {}

  // @ts-ignore
  abstract async handle(
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any | void>;
}
