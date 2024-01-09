import {getDIDFromURI, getPostDetails, getPosterDID} from "../utils/agent-post-utils";
import {AbstractValidator} from "./AbstractValidator";
import {ValidatorInput} from "../types/ValidatorInput";

export class PostedByUserValidator extends AbstractValidator {

    constructor(private userDid: string) {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        // @ts-ignore
        let postDetails = await getPostDetails(validatorInput.agentDetails.agent, validatorInput.op, validatorInput.repo)
        let posterDID = getPosterDID(postDetails);
        return this.userDid === posterDID;
    }

}

export class ReplyingToBotValidator extends AbstractValidator {

    constructor() {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        // @ts-ignore
        let postDetails = await getPostDetails(validatorInput.agentDetails.agent, validatorInput.op, validatorInput.repo)
        // @ts-ignore
        let posterDID = getDIDFromURI(postDetails.value.reply.parent.uri);
        return validatorInput.agentDetails.did === posterDID;
    }

}
