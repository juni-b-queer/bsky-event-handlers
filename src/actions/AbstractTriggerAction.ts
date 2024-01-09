import { BskyAgent } from "@atproto/api";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {PostDetails} from "../types/PostDetails";
import {AgentDetails} from "../types/AgentDetails";

export abstract class AbstractTriggerAction {
    constructor() {
    }

    // @ts-ignore
    abstract async handle(agentDetails: AgentDetails|undefined, op: RepoOp, postDetails: PostDetails): Promise<any | void>
}


