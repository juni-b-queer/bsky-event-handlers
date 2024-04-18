import { AbstractValidator } from "../validations/AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostDetails } from "../types/PostDetails";
import { AbstractTriggerAction } from "../actions/AbstractTriggerAction";
import { HandlerAgent } from "../agent/HandlerAgent";

export abstract class AbstractPayloadHandler {
  constructor(
    private triggerValidators: Array<AbstractValidator>,
    private triggerActions: Array<AbstractTriggerAction>,
    public handlerAgent: HandlerAgent,
  ) {}

  async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
    const willTrigger = true;
    for (const validator of this.triggerValidators) {
      const response = await validator.shouldTrigger(
        validatorInput,
        this.handlerAgent,
      );
      if (!response) {
        return false;
      }
    }
    return willTrigger;
  }

  async runActions(op: RepoOp, postDetails: PostDetails) {
    for (const action of this.triggerActions) {
      await action.handle(this.handlerAgent, op, postDetails);
    }
  }

  //@ts-ignore
  abstract async handle(op: RepoOp, repo: string): Promise<void>;
}
