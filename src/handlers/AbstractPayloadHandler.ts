import { BskyAgent } from "@atproto/api";
import {AbstractValidator} from "../validations/AbstractValidator";
import {ValidatorInput} from "../types/ValidatorInput";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {PostDetails} from "../types/PostDetails";
import {AbstractTriggerAction} from "../actions/AbstractTriggerAction";

export abstract class AbstractPayloadHandler {
    protected agentDid: string|undefined;
    protected agent: BskyAgent | undefined;

    constructor(private triggerValidators: Array<AbstractValidator>, private triggerActions: Array<AbstractTriggerAction>) {
    }

    setAgent(agent: BskyAgent) {
        this.agent = agent;
        this.agentDid = agent.session?.did
    }

    async shouldTrigger(validatorInput: ValidatorInput): Promise<boolean> {
        let willTrigger = true;
        for (const validator of this.triggerValidators) {
            let response = await validator.shouldTrigger(validatorInput)
            if (!response) {
                willTrigger = false
            }
        }
        return willTrigger;
    }

    async runActions(op: RepoOp, postDetails: PostDetails) {
        for (const action of this.triggerActions) {
            await action.handle(this.agent, op, postDetails)
        }
    }

    // @ts-ignore
    abstract async handle(op: RepoOp, repo: string): Promise<void>;

}