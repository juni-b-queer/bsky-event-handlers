import {
  AtpSessionData,
  AtpSessionEvent,
  BskyAgent,
  RichText,
} from "@atproto/api";
import { PostDetails } from "../types/PostDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AgentDetails } from "../types/AgentDetails";
import { debugLog } from "./logging-utils";

/**
 * Replies to the skeet
 **/
// TODO Move this to agent class
export async function replyToPost(
  agent: BskyAgent,
  currentPost: PostDetails,
  replyTextInput: string,
) {
  const replyText = new RichText({
    text: replyTextInput,
  });

  const reply = {
    root: {
      cid: currentPost.cid,
      uri: currentPost.uri,
    },
    parent: {
      cid: currentPost.cid,
      uri: currentPost.uri,
    },
  };

  // @ts-ignore
  if (currentPost.value.reply) {
    // @ts-ignore
    reply.root = currentPost.value.reply.root;
  }

  return await agent.post({
    reply: reply,
    text: replyText.text,
  });
}

export async function getPostDetails(
  agent: BskyAgent,
  op: RepoOp,
  repo: string,
): Promise<PostDetails> {
  const rkey = op.path.split("/")[1];
  return await agent.getPost({
    repo: repo,
    rkey: rkey,
  });
}

export function getPosterDID(postDetails: PostDetails) {
  return (postDetails.uri.match(/did:[^/]*/) || [])[0];
}

export function getDIDFromURI(uri: string) {
  return (uri.match(/did:[^/]*/) || [])[0];
}

export function createAgent(agentDetails: AgentDetails): AgentDetails {
  agentDetails.agent = new BskyAgent({
    service: "https://bsky.social/",
    persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
      agentDetails.did = sess?.did;
      agentDetails.sessionData = sess;
    },
  });
  return agentDetails;
}

// @ts-ignore
export async function authenticateAgent(
  agentDetails: AgentDetails,
): Promise<AgentDetails | undefined> {
  if (agentDetails.agent) {
    await agentDetails.agent.login({
      identifier: agentDetails.handle,
      password: agentDetails.password,
    });
    if (!agentDetails.sessionData) {
      throw new Error("Could not retrieve bluesky session data for reply bot");
    } else {
      debugLog("AGENT", `${agentDetails.name} is authenticated!`);
      // console.log()
    }
    await agentDetails.agent.resumeSession(agentDetails.sessionData);

    if (!agentDetails.agent) {
      throw new Error(`Could not get agent from ${agentDetails.name}`);
    }
    return agentDetails;
  }
}
