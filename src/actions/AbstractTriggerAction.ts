import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostDetails } from "../types/PostDetails";
import { AgentDetails } from "../types/AgentDetails";

export abstract class AbstractTriggerAction {
  constructor() {}
  //@ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
  abstract async handle(
    agentDetails: AgentDetails | undefined,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any | void>;
}
