import { BskyAgent } from "@atproto/api";
import {AbstractValidator} from "../validations/AbstractValidator";
import {ValidatorInput} from "../types/ValidatorInput";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {PostDetails} from "../types/PostDetails";
import {AbstractTriggerAction} from "../actions/AbstractTriggerAction";
import {AgentDetails} from "../types/AgentDetails";

export abstract class AbstractPayloadHandler {
    protected agentDetails: AgentDetails | undefined;

    constructor(private triggerValidators: Array<AbstractValidator>, private triggerActions: Array<AbstractTriggerAction>) {
    }

    setAgentDetails(agentDetails: AgentDetails) {
        this.agentDetails = agentDetails;
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let willTrigger = true;
        for (const validator of this.triggerValidators) {
            let response = await validator.shouldTrigger(validatorInput)
            if (!response) {
                return false;
            }
        }
        return willTrigger;
    }

    async runActions(op: RepoOp, postDetails: PostDetails) {
        for (const action of this.triggerActions) {
            await action.handle(this.agentDetails, op, postDetails)
        }
    }

    // @ts-ignore
    abstract async handle(agentDetails: AgentDetails, op: RepoOp, repo: string): Promise<void>;

}