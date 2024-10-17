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
    NewSkeetRecord,
    Reply,
    Subject,
} from '../types/JetstreamTypes';
import { DebugLog } from '../utils/DebugLog';
import { ReplyRef } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

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
     * getProfile
     */

    async getProfile(did: string) {
        const response = await this.agent?.getProfile({ actor: did });
        return response?.data;
    }

    /**
     *
     */
    async getFollows(
        userDID: string | undefined = undefined,
        cursor: string | undefined = undefined,
        limit: number = 50
    ) {
        if (userDID === undefined) {
            userDID = this.getDid;
        }
        const body = {
            actor: userDID,
            cursor: cursor,
            limit: limit,
        };
        const resp = await this.agent?.getFollows(body);
        return resp?.data;
    }

    /**
     *
     */
    async getFollowers(
        userDID: string | undefined = undefined,
        cursor: string | undefined = undefined,
        limit: number = 50
    ) {
        if (userDID === undefined) {
            userDID = this.getDid;
        }
        const body = {
            actor: userDID,
            cursor: cursor,
            limit: limit,
        };
        const resp = await this.agent?.getFollowers(body);
        return resp?.data;
    }

    /**
     *
     */
    async isFollowing(userDID: string): Promise<boolean> {
        const followProfile = await this.getProfile(userDID);
        if (!followProfile) {
            return false;
        }
        const viewer = followProfile?.viewer;
        if (!viewer?.following) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    async isFollowedBy(userDID: string): Promise<boolean> {
        const followProfile = await this.getProfile(userDID);
        if (!followProfile) {
            return false;
        }
        const viewer = followProfile?.viewer;
        if (!viewer?.followedBy) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    async followUser(userDID: string): Promise<boolean> {
        await this.agent?.follow(userDID);
        return true;
    }

    /**
     *
     */
    async unfollowUser(userDID: string): Promise<boolean> {
        const followProfile = await this.getProfile(userDID);
        if (!followProfile) {
            return false;
        }
        const followLink = followProfile?.viewer?.following;
        console.log(followProfile.viewer);
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
        if (this.getAgent !== undefined) {
            await replyText.detectFacets(this.getAgent);
        }
        // @ts-ignore
        const record: NewSkeetRecord = {
            text: replyText.text,
        };
        if (skeetReply !== undefined) {
            // @ts-ignore
            record.reply = skeetReply;
        }
        if (replyText.facets !== undefined) {
            // @ts-ignore
            record.facets = replyText.facets;
        }

        return await this.agent?.post(record as any);
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
    async unlikeSkeet(skeetUri: string) {
        const likeUri: string = await this.findLikeRecord(skeetUri);
        if (likeUri == '') {
            return false;
        }
        await this.agent?.deleteLike(likeUri);
        return true;
    }

    /**
     *
     */
    async reskeetSkeet(skeetURI: string, skeetCID: string) {
        await this.agent?.repost(skeetURI, skeetCID);
        return true;
    }

    /**
     *
     */
    async unreskeetSkeet(skeetUri: string) {
        const reskeetUri: string = await this.findRepostRecord(skeetUri);
        if (reskeetUri == '') {
            return false;
        }
        await this.agent?.deleteRepost(reskeetUri);
        return true;
    }

    //endregion

    //region Post Helpers

    /**
     * Finds a record that is similar to a given skeet URI.
     *
     * @param {string} skeetUri - The skeet URI to find a similar record for.
     * @param {string} [cursor=undefined] - The optional cursor to paginate results.
     * @param {number} [attempt=1] - The number of attempts made to find the record.
     * @returns {Promise<string>} A promise that resolves to the ID of the found record.
     */
    async findLikeRecord(
        skeetUri: string,
        cursor: string | undefined = undefined,
        attempt: number = 1
    ): Promise<string> {
        return this.findSpecificRecord(
            'app.bsky.feed.like',
            'like',
            skeetUri,
            cursor,
            attempt
        );
    }

    /**
     * Finds a repost record based on the given parameters.
     * @param {string} skeetUri - The skeet URI to search for.
     * @param {string | undefined} cursor - Optional cursor for pagination.
     * @param {number} attempt - The attempt number for the search.
     * @return {Promise<string>} - A Promise that resolves to the found repost record.
     */
    async findRepostRecord(
        skeetUri: string,
        cursor: string | undefined = undefined,
        attempt: number = 1
    ): Promise<string> {
        return this.findSpecificRecord(
            'app.bsky.feed.repost',
            'repost',
            skeetUri,
            cursor,
            attempt
        );
    }

    /**
     * Finds a specific record in a collection.
     *
     * @param {string} collectionType - The type of collection to search in.
     * @param {string} errorName - The name of the error associated with the record.
     * @param {string} skeetUri - The URI of the record to find.
     * @param {string[]} cursor - The cursor used for pagination (optional).
     * @param {number} attempt - The attempt number (optional).
     *
     * @return {Promise<string>} - A promise that resolves to the URI of the found record.
     */
    async findSpecificRecord(
        collectionType: string,
        errorName: string,
        skeetUri: string,
        cursor: string | undefined = undefined,
        attempt: number = 1
    ): Promise<string> {
        const params = {
            repo: this.getDid,
            collection: collectionType,
            limit: 100,
        };

        if (cursor !== undefined) {
            // @ts-ignore
            params['cursor'] = cursor;
        }
        const recordsResponse =
            await this.agent?.api.com.atproto.repo.listRecords(params, {});
        if (recordsResponse == undefined) {
            DebugLog.error(
                'Handler Agent',
                `Failed to retrieve ${errorName} records`
            );
            return '';
        }
        const records = recordsResponse.data.records;
        cursor = recordsResponse.data.cursor;
        const record = records.find(
            // @ts-ignore
            (record) => record.value.subject.uri === skeetUri
        );

        if (record == null) {
            DebugLog.info('Handler Agent', `Attempt ${attempt} to find record`);
            if (attempt >= 25) {
                DebugLog.error(
                    'Handler Agent',
                    `Failed to retrieve ${errorName} record`
                );
                return '';
            }
            return await this.findSpecificRecord(
                collectionType,
                errorName,
                skeetUri,
                cursor,
                attempt + 1
            );
        }

        return record.uri;
    }

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
