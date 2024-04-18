import {AbstractTriggerAction} from "./AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {HandlerAgent} from "../agent/HandlerAgent";

export class FunctionAction extends AbstractTriggerAction {
  constructor(
    private actionFunction: (
      arg0: HandlerAgent,
      arg1: RepoOp,
      arg2: PostDetails,
    ) => any,
  ) {
    super();
  }
  async handle(
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    await this.actionFunction(handlerAgent, op, postDetails);
  }
}
