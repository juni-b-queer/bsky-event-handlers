import { AbstractTriggerAction } from "./AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";
import { AgentDetails } from "../types/AgentDetails";
import {HandlerAgent} from "../agent/HandlerAgent";

export class FunctionAction extends AbstractTriggerAction {
  constructor(
    private actionFunction: (
        // TODO Change to use agent class
      arg0: HandlerAgent,
      arg1: RepoOp,
      arg2: PostDetails,
    ) => any,
  ) {
    super();
  }
  async handle(
      // TODO Change to use agent class
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    // TODO Change to use agent class

    await this.actionFunction(handlerAgent, op, postDetails);
  }
}
