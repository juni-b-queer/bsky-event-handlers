import { BskyAgent } from "@atproto/api";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {PostDetails} from "../types/PostDetails";

export abstract class AbstractTriggerAction {
    constructor() {
    }

    // @ts-ignore
    abstract async handle(agent: BskyAgent|undefined, op: RepoOp, postDetails: PostDetails): Promise<any | void>
}


