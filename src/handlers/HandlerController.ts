import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {PostHandler} from "./PostHandler";
import { BskyAgent } from "@atproto/api";
import {AbstractPayloadHandler} from "./AbstractPayloadHandler";

export class HandlerController {
    constructor(private agent: BskyAgent, private handlers: Array<AbstractPayloadHandler>) {
        this.refreshFollowers()
    }

    refreshFollowers() {
        if (this.agent.session?.did) {
            this.agent.getFollowers({actor: this.agent.session.did}, {}).then((resp) => {
                let followers = resp.data.followers.map(profile => profile.did);
                this.handlers.forEach((handler) => {
                    handler.setAgent(this.agent)
                    if (handler instanceof PostHandler) {
                        handler.setFollowers(followers);
                    }
                })
            });
        }
    }

    handle(op: RepoOp, repo: string) {
        this.handlers.forEach((handler) => {
            handler.handle(op, repo)
        })
    }
}