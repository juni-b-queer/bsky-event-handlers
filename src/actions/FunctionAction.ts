import { AbstractTriggerAction } from "./AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";
import { AgentDetails } from "../types/AgentDetails";

export class FunctionAction extends AbstractTriggerAction {
  constructor(
    private actionFunction: (
      arg0: AgentDetails,
      arg1: RepoOp,
      arg2: PostDetails,
    ) => any,
  ) {
    super();
  }
  async handle(
    agentDetails: AgentDetails,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    await this.actionFunction(agentDetails, op, postDetails);
  }
}
