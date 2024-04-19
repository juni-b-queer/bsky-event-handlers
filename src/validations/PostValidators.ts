import { AbstractValidator } from "./AbstractValidator";
import { ValidatorInput } from "../types/ValidatorInput";
import { HandlerAgent } from "../agent/HandlerAgent";
import { CreateSkeetMessage } from "../types/JetstreamTypes";
import { ComAtprotoServerCreateAccount } from "@atproto/api";

export class PostedByUserValidator extends AbstractValidator {
  constructor(private userDid: string) {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    return this.userDid === message.did;
  }
}

export class ReplyingToBotValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    // @ts-ignore
    // let postDetails = await getPostDetails(validatorInput.agentDetails.agent, validatorInput.op, validatorInput.repo)

    const posterDID = message.did;

    return handlerAgent.getDid === posterDID;
  }
}

export class IsReplyValidator extends AbstractValidator {
  constructor() {
    super();
  }

  async shouldTrigger(
    message: CreateSkeetMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    // @ts-ignore
    return message.record.reply !== undefined;
  }
}
