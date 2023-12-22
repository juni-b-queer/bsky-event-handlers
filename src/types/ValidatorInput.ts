import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

export type ValidatorInput = {
    op: RepoOp,
    repo: string,
    agent: BskyAgent
}

// module.exports = {
//     ValidatorInput
// };