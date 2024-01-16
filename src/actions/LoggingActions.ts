import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {AbstractTriggerAction} from "./AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import {AgentDetails} from "../types/AgentDetails";
import {debugLog} from "../utils/logging-utils";

export class LogPostDetailsAction extends AbstractTriggerAction{
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        console.log(postDetails)
    }
}

export class LogRepoOperationAction extends AbstractTriggerAction{
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        console.log(op)
    }
}

export class LogInputTextAction extends AbstractTriggerAction{
    constructor(private logText: string) {
        super();
    }
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        console.log(this.logText)
    }
}

export class DebugLogAction extends AbstractTriggerAction{
    constructor(private action: string, private message: string, private error: boolean = false) {
        super();
    }
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        debugLog(this.action, this.message, this.error)
    }
}