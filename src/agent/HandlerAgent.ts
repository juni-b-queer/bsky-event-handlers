import {
  AppBskyFeedPost,
  AtpSessionData,
  AtpSessionEvent,
  BskyAgent,
  RichText,
} from "@atproto/api";
import { debugLog } from "../utils/logging-utils";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { PostDetails } from "../types/PostDetails";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export class HandlerAgent {
  private did: string | undefined;
  private session: AtpSessionData | undefined;
  private agent: BskyAgent;

  /**
   *
   */
  constructor(
    private agentName: string,
    private handle: string,
    private password: string,
    agent: BskyAgent | null = null,
  ) {
    if (!agent) {
      this.agent = this.initializeBskyAgent();
    } else {
      this.agent = agent;
      this.setDid = agent.session?.did;
      this.setSession = agent.session;
    }

    // this.persistSession = this.persistSession.bind(this);
    // this.initializeBskyAgent = this.initializeBskyAgent.bind(this);
  }

  //region INIT Agent

  /**
   *
   */
  initializeBskyAgent(): BskyAgent {
    return new BskyAgent({
      service: "https://bsky.social/",
      persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
        this.setDid = sess?.did;
        this.setSession = sess;
      },
    });
  }

  /**
   *
   */
  async authenticate() {
    if (!this.agent) {
      this.agent = this.initializeBskyAgent();
    }
    if (this.agent) {
      await this.agent.login({
        identifier: this.handle,
        password: this.password,
      });
      if (!this.session) {
        throw new Error(
          "Could not retrieve bluesky session data for reply bot",
        );
      } else {
        debugLog("AGENT", `${this.agentName} is authenticated!`);
        // console.log()
      }
      await this.agent.resumeSession(this.session);

      if (!this.agent) {
        throw new Error(`Could not get agent from ${this.agentName}`);
      }
      return this;
    }
  }

  //endregion

  //region Follower Interactions
  /**
   *
   */
  async getFollows(userDID: string | undefined = undefined) {
    if (userDID === undefined) {
      userDID = this.getDid;
    }
    const resp = await this.agent.getFollows({ actor: userDID });
    return resp.data.follows;
  }

  /**
   *
   */
  async getFollowers(userDID: string | undefined = undefined) {
    if (userDID === undefined) {
      userDID = this.getDid;
    }
    const resp = await this.agent.getFollowers({ actor: userDID });
    return resp.data.followers;
  }

  /**
   *
   */
  async isFollowing(userDID: string): Promise<boolean> {
    const following = this.extractDIDsFromProfiles(await this.getFollows());
    return following.includes(userDID);
  }

  /**
   *
   */
  async isFollowedBy(userDID: string): Promise<boolean> {
    const followers = this.extractDIDsFromProfiles(await this.getFollowers());
    return followers.includes(userDID);
  }

  /**
   *
   */
  async followUser(did: string): Promise<boolean> {
    await this.agent.follow(did);
    return true;
  }

  /**
   *
   */
  async unfollowUser(did: string): Promise<boolean> {
    const resp = this.getRecordForDid(did, await this.getFollows());
    const followLink = resp?.viewer?.following;
    if (followLink) {
      await this.agent.deleteFollow(followLink);
      return true;
    }
    return false;
  }

  //endregion

  //region Follow Helpers

  /**
   *
   * @param follows
   */
  extractDIDsFromProfiles(follows: ProfileView[]): string[] {
    return follows.map((item) => item.did);
  }

  getRecordForDid(
    targetDid: string,
    data: ProfileView[],
  ): ProfileView | undefined {
    return data.find((item) => item.did === targetDid);
  }

  //endregion

  //region Post interactions

  /**
   *
   */
  async getPostDetails(op: RepoOp, repo: string) {
    const rkey = op.path.split("/")[1];
    return await this.agent.getPost({
      repo: repo,
      rkey: rkey,
    });
  }

  /**
   *
   * @param details
   */
  async post(
    details: Partial<AppBskyFeedPost.Record> &
      Omit<AppBskyFeedPost.Record, "createdAt">,
  ) {
    return await this.agent.post(details);
  }

  /**
   *
   */
  async createSkeet(
    newPostDetails: string,
    existingPostDetails: PostDetails | null = null,
  ) {
    const replyText = new RichText({
      text: newPostDetails,
    });
    if (!existingPostDetails) {
      // if it's not a reply
      return await this.agent.post({
        text: replyText.text,
      });
    } else {
      const reply = {
        root: {
          cid: existingPostDetails.cid,
          uri: existingPostDetails.uri,
        },
        parent: {
          cid: existingPostDetails.cid,
          uri: existingPostDetails.uri,
        },
      };

      if (this.hasPostReplyRoot(existingPostDetails)) {
        reply.root = this.getPostReplyRoot(existingPostDetails);
      }

      return await this.agent.post({
        reply: reply,
        text: replyText.text,
      });
    }
  }

  /**
   *
   */
  deleteSkeet(skeet: string) {}

  /**
   *
   */
  likeSkeet(skeet: string) {}

  /**
   *
   */
  unlikeSkeet(skeet: string) {}

  /**
   *
   */
  reskeetSkeet(skeet: string) {}

  /**
   *
   */
  unreskeetSkeet(skeet: string) {}

  //endregion

  //region Post Helpers
  /**
   *
   */
  getPosterDID(postDetails: PostDetails) {
    return (postDetails.uri.match(/did:[^/]*/) || [])[0];
  }

  /**
   *
   */
  postedByAgent(postDetails: PostDetails) {
    // @ts-ignore
    return this.getPosterDID(postDetails) === this.getDid;
  }

  /**
   *
   */
  getDIDFromURI(uri: string) {
    return (uri.match(/did:[^/]*/) || [])[0];
  }

  hasPostReplyRoot(postDetails: PostDetails): boolean {
    if (
      "reply" in postDetails.value &&
      postDetails.value?.reply !== undefined
    ) {
      if (
        "root" in postDetails.value.reply &&
        postDetails.value.reply?.root !== undefined
      ) {
        return true;
      }
    }
    return false;
  }

  getPostReplyRoot(postDetails: PostDetails): any | boolean {
    if (
      "reply" in postDetails.value &&
      postDetails.value?.reply !== undefined
    ) {
      if (
        "root" in postDetails.value.reply &&
        postDetails.value.reply?.root !== undefined
      ) {
        return postDetails.value.reply.root;
      }
    }
    return false;
  }

  //endregion

  // region class prop getters and setters

  /**
   * Setter for agent.
   * @param agent
   */
  public set setAgent(agent: BskyAgent) {
    this.agent = agent;
  }

  /**
   * Getter for agent.
   * @return {BskyAgent} The current value of agent.
   */
  public get getAgent(): BskyAgent | boolean {
    if (!this.agent) {
      return false;
    }
    return this.agent;
  }

  /**
   * Setter for agentName.
   * @param {string} value - The new value for agentName.
   */
  public set setAgentName(value: string) {
    this.agentName = value;
  }

  /**
   * Getter for agentName.
   * @return {string} The current value of agentName.
   */
  public get getAgentName(): string | boolean {
    if (!this.agentName) {
      return false;
    }
    return this.agentName;
  }

  /**
   * Setter for handle.
   * @param {string} value - The new value for handle.
   */
  public set setHandle(value: string) {
    this.handle = value;
  }

  /**
   * Getter for handle.
   * @return {string} The current value of handle.
   */
  public get getHandle(): string | boolean {
    if (!this.handle) {
      return false;
    }
    return this.handle;
  }

  /**
   * Setter for password.
   * @param {string} value - The new value for password.
   */
  public set setPassword(value: string) {
    this.password = value;
  }

  /**
   * Setter for did.
   * @param {string} value - The new value for did.
   */
  public set setDid(value: string | undefined) {
    this.did = value;
  }

  /**
   * Getter for did.
   * @return {string} The current value of did.
   */
  public get getDid(): string {
    if (!this.did) {
      return "";
    }
    return this.did;
  }

  /**
   * Setter for session.
   * @param sess
   */
  public set setSession(sess: AtpSessionData | undefined) {
    this.session = sess;
  }

  /**
   * Getter for session.
   * @return {any} The current value of session.
   */
  public get getSession(): AtpSessionData | boolean {
    if (!this.session) {
      return false;
    }
    return this.session;
  }

  //endregion
}
