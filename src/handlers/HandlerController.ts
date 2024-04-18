import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostHandler } from "./PostHandler";
import { BskyAgent } from "@atproto/api";
import { AbstractPayloadHandler } from "./AbstractPayloadHandler";
import { AgentDetails } from "../types/AgentDetails";

export class HandlerController {
  constructor(
    private agentDetails: AgentDetails,
    private handlers: Array<AbstractPayloadHandler>,
    private replyOnly: boolean = false,
  ) {
    this.refreshFollowers();
  }

  public isReplyOnly(): boolean {
    return this.replyOnly;
  }

  refreshFollowers() {
    if (!this.agentDetails.agent) {
      return;
    }
    if (this.agentDetails.agent.session?.did) {
      this.agentDetails.agent
        .getFollowers({ actor: this.agentDetails.agent.session.did }, {})
        .then((resp) => {
          const followers = resp.data.followers.map((profile) => profile.did);
          this.handlers.forEach((handler) => {
            // @ts-ignore
            handler.setAgentDetails(this.agentDetails);
            if (handler instanceof PostHandler) {
              handler.setFollowers(followers);
            }
          });
        });
    }
  }

  handle(op: RepoOp, repo: string) {
    this.handlers.forEach((handler) => {
      handler.handle(this.agentDetails, op, repo);
    });
  }
}
