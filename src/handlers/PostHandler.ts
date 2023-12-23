import {AbstractPayloadHandler} from "./AbstractPayloadHandler";
import {AbstractValidator} from "../validations/AbstractValidator";
import {AbstractTriggerAction} from "../actions/AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import {getPostDetails, getPosterDID} from "../utils/agent-post-utils";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {ValidatorInput} from "../types/ValidatorInput";

// @ts-ignore
export class PostHandler extends AbstractPayloadHandler {
    protected FOLLOWERS: Array<string> | undefined

    constructor(private triggerValidators: Array<AbstractValidator>, private triggerActions: Array<AbstractTriggerAction>, private requireFollowing = true) {
        super(triggerValidators, triggerActions);
        return this;
    }

    setFollowers(followersInput: Array<string>) {
        this.FOLLOWERS = followersInput
        return this;
    }

    postedByUser(postDetails: PostDetails) {
        let postDid = getPosterDID(postDetails);

        return postDid === this.agentDid
    }

    postedByFollower(postDetails: PostDetails) {
        let userPosterDID = getPosterDID(postDetails)
        if (!userPosterDID) {
            return false;
        }
        // @ts-ignore
        return this.FOLLOWERS.includes(userPosterDID);
    }

    async handle(op: RepoOp, repo: string): Promise<void> {
        let validatorData: ValidatorInput = {
            op: op,
            repo: repo,
            // @ts-ignore
            agent: this.agent
        }
        let shouldTrigger = await this.shouldTrigger(validatorData);
        if (shouldTrigger) {
            try {
                // @ts-ignore
                let postDetails = await getPostDetails(this.agent, op, repo);
                if (!this.postedByUser(postDetails)) {
                    if (this.requireFollowing) {
                        if (this.postedByFollower(postDetails)) {
                            await this.runActions(op, postDetails)
                        }
                    } else {
                        await this.runActions(op, postDetails)
                    }
                }
            } catch (exception) {
                console.log(exception)
            }

        }
    }
}