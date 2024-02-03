import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { ValidatorInput } from "../types/ValidatorInput";

export abstract class AbstractValidator {
  constructor() {}

  getTextFromPost(op: RepoOp) {
    // @ts-ignore
    return op.payload.text;
  }

  // @ts-ignore
  abstract async shouldTrigger(
    validatorInput: ValidatorInput,
  ): Promise<boolean>;
}
