import {getPostDetails, getPosterDID} from "../utils/agent-post-utils";
import {AbstractValidator} from "./AbstractValidator";
import {ValidatorInput} from "../types/ValidatorInput";

export class PostedByUserValidator extends AbstractValidator {

    constructor(private userDid: string) {
        super()
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let postDetails = await getPostDetails(validatorInput.agent, validatorInput.op, validatorInput.repo)
        let posterDID = getPosterDID(postDetails);
        return this.userDid === posterDID;
    }

}
