import {
    AppBskyFeedPost,
    AtpSessionData,
    AtpSessionEvent,
    BskyAgent,
    RichText,
} from '@atproto/api';
import { debugLog } from '../utils/logging-utils';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import {
    CreateSkeetMessage,
    JetstreamMessage,
    Reply,
    Subject,
} from '../types/JetstreamTypes';

export class HandlerAgent {
    private did: string | undefined;
    private session: AtpSessionData | undefined;
    private agent: BskyAgent | undefined;

    /**
     *
     */
    constructor(
        private agentName: string,
        private handle: string,
        private password: string,
        agent: BskyAgent | undefined = undefined
    ) {
        if (!agent) {
            this.agent = this.initializeBskyAgent();
        } else {
            this.agent = agent;
            this.setDid = agent.session?.did;
            this.setSession = agent.session;
        }
    }

    //region INIT Agent

    /**
     *
     */
    initializeBskyAgent(): BskyAgent {
        return new BskyAgent({
            service: 'https://bsky.social/',
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
                    'Could not retrieve bluesky session data for reply bot'
                );
            } else {
                debugLog('AGENT', `${this.agentName} is authenticated!`);
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
        const resp = await this.agent?.getFollows({ actor: userDID });
        return resp?.data.follows;
    }

    /**
     *
     */
    async getFollowers(userDID: string | undefined = undefined) {
        if (userDID === undefined) {
            userDID = this.getDid;
        }
        const resp = await this.agent?.getFollowers({ actor: userDID });
        return resp?.data.followers;
    }

    /**
     *
     */
    async isFollowing(userDID: string): Promise<boolean> {
        const getFollowsResponse = await this.getFollows();

        if (Array.isArray(getFollowsResponse)) {
            const following = this.extractDIDsFromProfiles(getFollowsResponse);
            return following.includes(userDID);
        }
        return false;
    }

    /**
     *
     */
    async isFollowedBy(userDID: string): Promise<boolean> {
        const getFollowerResponse = await this.getFollowers();
        if (Array.isArray(getFollowerResponse)) {
            const followers = this.extractDIDsFromProfiles(getFollowerResponse);
            return followers.includes(userDID);
        }
        return false;
    }

    /**
     *
     */
    async followUser(did: string): Promise<boolean> {
        await this.agent?.follow(did);
        return true;
    }

    /**
     *
     */
    async unfollowUser(did: string): Promise<boolean> {
        const getFollowsResponse = await this.getFollows();

        if (!Array.isArray(getFollowsResponse)) {
            return false;
        }
        const resp = this.getRecordForDid(did, getFollowsResponse);
        const followLink = resp?.viewer?.following;
        if (followLink) {
            await this.agent?.deleteFollow(followLink);
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
        data: ProfileView[]
    ): ProfileView | undefined {
        return data.find((item) => item.did === targetDid);
    }

    //endregion

    //region Post interactions

    /**
     *
     * @param details
     */
    async post(
        details: Partial<AppBskyFeedPost.Record> &
            Omit<AppBskyFeedPost.Record, 'createdAt'>
    ) {
        return await this?.agent?.post(details);
    }

    /**
     *
     */
    async createSkeet(
        newPostDetails: string,
        skeetReply: Reply | undefined = undefined
    ) {
        // TODO Add in handling for facets and maybe images?
        const replyText = new RichText({
            text: newPostDetails,
        });
        if (skeetReply == undefined) {
            // if it's not a reply
            return await this.agent?.post({
                text: replyText.text,
            });
        } else {
            return await this.agent?.post({
                // @ts-ignore
                reply: skeetReply,
                text: replyText.text,
            });
        }
    }

    /**
     *
     */
    async deleteSkeet(skeetURI: string) {
        await this.agent?.deletePost(skeetURI);
        // TODO error handling
        return true;
    }

    /**
     *
     */
    async likeSkeet(skeetURI: string, skeetCID: string) {
        await this.agent?.like(skeetURI, skeetCID);
        // TODO error handling
        return true;
    }

    /**
     *
     */
    async unlikeSkeet(likeURI: string) {
        // TODO add logic for finding likeURI given a skeetUri

        await this.agent?.deleteLike(likeURI);
        // TODO error handling
        return true;
    }

    /**
     *
     */
    async reskeetSkeet(skeetURI: string, skeetCID: string) {
        await this.agent?.repost(skeetURI, skeetCID);
        // TODO add error handling
        return true;
    }

    /**
     *
     */
    async unreskeetSkeet(reskeetURI: string) {
        // TODO add logic for finding reskeetURI given a skeetUri

        await this.agent?.deleteRepost(reskeetURI);
        // TODO error handling
        return true;
    }

    //endregion

    //region Post Helpers
    /**
     *
     */
    getDIDFromUri(uri: string) {
        return (uri.match(/did:[^/]*/) || [])[0];
    }

    /**
     *
     */
    postedByAgent(message: JetstreamMessage) {
        return message.did === this.getDid; //TODO Test
    }

    /**
     *
     */
    generateURIFromCreateMessage(message: CreateSkeetMessage) {
        return `at://${message.did}/app.bsky.feed.post/${message.rkey}`;
    }

    /**
     *
     */
    generateReplyFromMessage(message: CreateSkeetMessage): Reply {
        let reply: Reply; //TODO Test
        const parentReply: Subject = {
            cid: message.cid,
            uri: `at://${message.did}/app.bsky.feed.post/${message.rkey}`,
        };
        // if message is a reply
        if (message.record.reply) {
            reply = {
                root: message.record.reply.root,
                parent: parentReply,
            };
        } else {
            reply = {
                root: parentReply,
                parent: parentReply,
            };
        }
        return reply;
    }

    hasPostReply(message: CreateSkeetMessage) {
        return 'reply' in message.record && message.record?.reply !== undefined;
    }

    getPostReply(message: CreateSkeetMessage) {
        return message.record.reply;
    }

    //endregion

    // region class prop getters and setters

    /**
     * Setter for agent.
     * @param agent
     */
    public set setAgent(agent: BskyAgent | undefined) {
        this.agent = agent;
    }

    /**
     * Getter for agent.
     * @return {BskyAgent} The current value of agent.
     */
    public get getAgent(): BskyAgent | undefined {
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
    public get getAgentName(): string {
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
    public get getHandle(): string {
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
     * Getter for password.
     * @return {string} The current value of password.
     */
    public get getPassword(): string {
        return this.password;
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
            return '';
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
            return false; //TODO Test
        }
        return this.session;
    }

    //endregion
}
