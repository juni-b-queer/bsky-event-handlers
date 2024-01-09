import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {AgentDetails} from "./AgentDetails";

export type ValidatorInput = {
    op: RepoOp,
    repo: string,
    agentDetails: AgentDetails
}