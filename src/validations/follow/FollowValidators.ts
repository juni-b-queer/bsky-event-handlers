
import {CreateMessage, JetstreamMessage} from "../../types/JetstreamTypes";
import {AbstractValidator} from "../AbstractValidator";
import {HandlerAgent} from "../../agent/HandlerAgent";

export class NewFollowerForUserValidator extends AbstractValidator {
  constructor(private userDid: string | undefined) {
    super();
  }

  async shouldTrigger(
    message: CreateMessage,
    handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    if (!this.userDid){
      return handlerAgent.getDid === message.record.subject;
    }
    return this.userDid === message.record.subject;
  }
}

export class UserFollowedValidator extends AbstractValidator {
  constructor(private userDid: string | undefined) {
    super();
  }

  async shouldTrigger(
      message: CreateMessage,
      handlerAgent: HandlerAgent,
  ): Promise<boolean> {
    if (!this.userDid){
      return handlerAgent.getDid === message.did;
    }
    return this.userDid === message.did;
  }
}
