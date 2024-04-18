import { AbstractPayloadHandler } from "./AbstractPayloadHandler";
import { AbstractValidator } from "../validations/AbstractValidator";
import { AbstractTriggerAction } from "../actions/AbstractTriggerAction";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { ValidatorInput } from "../types/ValidatorInput";
import { HandlerAgent } from "../agent/HandlerAgent";

// @ts-ignore
export class PostHandler extends AbstractPayloadHandler {
  protected FOLLOWERS: Array<string> | undefined;

  constructor(
    private triggerValidators: Array<AbstractValidator>,
    private triggerActions: Array<AbstractTriggerAction>,
    public handlerAgent: HandlerAgent,
  ) {
    super(triggerValidators, triggerActions, handlerAgent);
    return this;
  }

  async handle(op: RepoOp, repo: string): Promise<void> {
    const validatorData: ValidatorInput = {
      op: op,
      repo: repo,
    };
    const shouldTrigger = await this.shouldTrigger(validatorData);
    if (shouldTrigger) {
      try {
        // @ts-ignore
        const postDetails = await this.handlerAgent.getPostDetails(op, repo);
        if (!this.handlerAgent.postedByAgent(postDetails)) {
          await this.runActions(op, postDetails);
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }
}
