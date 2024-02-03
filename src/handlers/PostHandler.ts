import { AbstractPayloadHandler } from "./AbstractPayloadHandler";
import { AbstractValidator } from "../validations/AbstractValidator";
import { AbstractTriggerAction } from "../actions/AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { getPostDetails, getPosterDID } from "../utils/agent-post-utils";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { ValidatorInput } from "../types/ValidatorInput";
import { AgentDetails } from "../types/AgentDetails";

// @ts-ignore
export class PostHandler extends AbstractPayloadHandler {
  protected FOLLOWERS: Array<string> | undefined;

  constructor(
    private triggerValidators: Array<AbstractValidator>,
    private triggerActions: Array<AbstractTriggerAction>,
    private requireFollowing = true,
  ) {
    super(triggerValidators, triggerActions);
    return this;
  }

  setFollowers(followersInput: Array<string>) {
    this.FOLLOWERS = followersInput;
    return this;
  }

  postedByUser(postDetails: PostDetails) {
    const postDid = getPosterDID(postDetails);

    // @ts-ignore
    return postDid === this.agentDetails.did;
  }

  postedByFollower(postDetails: PostDetails, repo: string) {
    // @ts-ignore
    return this.FOLLOWERS.includes(repo);
  }

  async handle(
    agentDetails: AgentDetails,
    op: RepoOp,
    repo: string,
  ): Promise<void> {
    this.setAgentDetails(agentDetails);
    const validatorData: ValidatorInput = {
      op: op,
      repo: repo,
      // @ts-ignore
      agentDetails: agentDetails,
    };
    const shouldTrigger = await this.shouldTrigger(validatorData);
    if (shouldTrigger) {
      try {
        // console.log(agentDetails)
        // console.log(this.agentDetails)
        // @ts-ignore
        const postDetails = await getPostDetails(agentDetails.agent, op, repo);
        if (!this.postedByUser(postDetails)) {
          if (this.requireFollowing) {
            if (this.postedByFollower(postDetails, repo)) {
              await this.runActions(op, postDetails);
            }
          } else {
            await this.runActions(op, postDetails);
          }
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }
}
