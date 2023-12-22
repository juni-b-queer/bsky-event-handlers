import {AbstractTriggerAction} from "./AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

export class FunctionTriggerAction extends AbstractTriggerAction {
    constructor(private actionFunction: (arg0: BskyAgent, arg1: RepoOp, arg2: PostDetails) => any) {
        super();
    }
    async handle(agent: BskyAgent, op: RepoOp, postDetails: PostDetails): Promise<any> {
        await this.actionFunction(agent, op, postDetails)
    }
}