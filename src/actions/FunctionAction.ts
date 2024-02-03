import { AbstractTriggerAction } from "./AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AgentDetails } from "../types/AgentDetails";

export class FunctionAction extends AbstractTriggerAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private actionFunction: (
      arg0: AgentDetails,
      arg1: RepoOp,
      arg2: PostDetails,
    ) => any,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(
    agentDetails: AgentDetails,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    await this.actionFunction(agentDetails, op, postDetails);
  }
}
