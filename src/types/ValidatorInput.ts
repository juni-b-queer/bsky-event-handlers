import { BskyAgent } from "@atproto/api";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AgentDetails } from "./AgentDetails";
// TODO change to agent? But do i need it? can we just always inject agent into validator?
export type ValidatorInput = {
  op: RepoOp;
  repo: string;
  agentDetails: AgentDetails;
};
