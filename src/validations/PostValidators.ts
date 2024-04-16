import {
  getDIDFromURI,
  getPostDetails,
  getPosterDID,
} from "../utils/agent-post-utils";
import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";

export class PostedByUserValidator extends AbstractValidator {
  constructor(private userDid: string) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
    return this.userDid === validatorInput.repo;
  }
}

export class ReplyingToBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
    // @ts-ignore
    // let postDetails = await getPostDetails(validatorInput.agentDetails.agent, validatorInput.op, validatorInput.repo)
    // @ts-ignore
    const posterDID = getDIDFromURI(validatorInput.op.payload.reply.parent.uri);
    // TODO change to use new agent class
    return validatorInput.agentDetails.did === posterDID;
  }
}

export class IsReplyValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
    const payload = validatorInput.op.payload;
    // @ts-ignore
    console.log(payload.reply);
    // @ts-ignore
    return payload.reply !== undefined;
  }
}
