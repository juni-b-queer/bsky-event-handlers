import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import {HandlerAgent} from "../agent/HandlerAgent";

export class PostedByUserValidator extends AbstractValidator {
  constructor(private userDid: string) {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    return this.userDid === validatorInput.repo;
  }
}

export class ReplyingToBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    // @ts-ignore
    // let postDetails = await getPostDetails(validatorInput.agentDetails.agent, validatorInput.op, validatorInput.repo)
    // @ts-ignore
    const posterDID = handlerAgent.getDIDFromURI(validatorInput.op.payload.reply.parent.uri);

    return handlerAgent.getDid === posterDID;
  }
}

export class IsReplyValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(validatorInput: ValidatorInput, handlerAgent: HandlerAgent): Promise<boolean> {
    const payload = validatorInput.op.payload;
    // @ts-ignore
    console.log(payload.reply);
    // @ts-ignore
    return payload.reply !== undefined;
  }
}
