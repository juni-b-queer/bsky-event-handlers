import { AtpAgent } from '@atproto/api';
import { mockDeep } from 'jest-mock-extended';
import { HandlerAgent } from '../../src';

describe('HandlerAgentThreadDetails', () => {
    const mockAtpAgent = mockDeep<AtpAgent>();
    const sessData = {
        did: 'did:plc:mockdid',
        handle: 'mockhandle.test',
        email: 'mock@example.com',
        emailConfirmed: true,
        accessJwt: 'mock-access-jwt',
        refreshJwt: 'mock-refresh-jwt',
    };
    Object.defineProperty(mockAtpAgent, 'session', {
        value: sessData,
        writable: false,
    });
    let handlerAgent: HandlerAgent;

    const postUri = 'at://did:plc:other/app.bsky.feed.post/example';
    const mockGetPostThreadResp = {
        success: true,
        headers: {},
        data: {
            thread: {
                $type: 'app.bsky.feed.defs#threadViewPost',
                post: {
                    uri: 'at://did:plc:other/app.bsky.feed.post/example',
                    cid: 'blahblahblah',
                    author: {
                        did: 'did:plc:other',
                        handle: 'testing.com',
                        displayName: '(Dev)',
                        avatar: 'https://blah.blah.com',
                        viewer: {
                            muted: false,
                            blockedBy: false,
                            following:
                                'at://did:plc:other/app.bsky.graph.follow/blah',
                            followedBy:
                                'at://did:plc:example/app.bsky.graph.follow/blah',
                        },
                        labels: [],
                        createdAt: '2023-09-19T17:34:00.094Z',
                    },
                    record: {
                        $type: 'app.bsky.feed.post',
                        createdAt: '2025-05-09T16:45:35.345Z',
                        langs: ['en'],
                        text: 'Test (Users I follow)',
                    },
                    replyCount: 0,
                    repostCount: 0,
                    likeCount: 0,
                    quoteCount: 0,
                    indexedAt: '2025-05-09T16:45:34.612Z',
                    viewer: {
                        threadMuted: false,
                        replyDisabled: false,
                        embeddingDisabled: false,
                    },
                    labels: [],
                    threadgate: {
                        uri: 'at://did:plc:other/app.bsky.feed.threadgate/blahhh',
                        cid: 'blahhhh',
                        record: {
                            $type: 'app.bsky.feed.threadgate',
                            allow: [
                                {
                                    $type: 'app.bsky.feed.threadgate#followingRule',
                                },
                            ],
                            createdAt: '2025-05-09T16:45:35.346Z',
                            hiddenReplies: [],
                            post: 'at://did:plc:other/app.bsky.feed.post/example',
                        },
                        lists: [],
                    },
                },
                replies: [],
                threadContext: {},
            },
            threadgate: {
                uri: 'at://did:plc:other/app.bsky.feed.threadgate/blahhh',
                cid: 'blahhhh',
                record: {
                    $type: 'app.bsky.feed.threadgate',
                    allow: [
                        {
                            $type: 'app.bsky.feed.threadgate#followingRule',
                        },
                    ],
                    createdAt: '2025-05-09T16:45:35.346Z',
                    hiddenReplies: [],
                    post: 'at://did:plc:other/app.bsky.feed.post/example',
                },
                lists: [],
            },
        },
    };

    const mockGetAuthorFeedResp = {
        data: {
            feed: [
                {
                    post: {
                        uri: 'at://did:plc:owwkhvrlmjoyphfkkkdit3w4/app.bsky.feed.post/3lz4r7snibp23',
                        cid: 'bafyreifb4ymseo6qw3e3bvkerpxbl2t3huqgkopjjk7hcgtwpux4yxbjyq',
                        author: {
                            did: 'did:plc:owwkhvrlmjoyphfkkkdit3w4',
                            handle: 'reminder-bot.juni-is.gay',
                            displayName: 'Reminder Bot!',
                            avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:owwkhvrlmjoyphfkkkdit3w4/bafkreicuhuwrmquqtlcvuii2dqblsrsvp4ftcr4gyxiyf3xonu7ujy77ty@jpeg',
                            associated: {},
                            viewer: {},
                            labels: [],
                            createdAt: '2023-12-09T00:19:21.794Z',
                        },
                        record: {
                            $type: 'app.bsky.feed.post',
                            createdAt: '2025-09-18T16:25:00.646Z',
                            reply: {},
                            text: 'Reminder set for September 18, 2025 at 02:24 PM CT',
                        },
                        bookmarkCount: 0,
                        replyCount: 1,
                        repostCount: 0,
                        likeCount: 2,
                        quoteCount: 0,
                        indexedAt: '2025-09-18T16:25:10.987Z',
                        viewer: {
                            bookmarked: false,
                            threadMuted: false,
                            embeddingDisabled: false,
                        },
                        labels: [],
                    },
                    reply: {
                        root: {
                            uri: 'at://did:plc:fz7okbhusu5f2gbzx5tyncgf/app.bsky.feed.post/3lz4o2zv3es2i',
                            cid: 'bafyreifnt3dzw5dspy44tjfoikaiiesqtryxvwvajd22giezg3uv3g4ywe',
                            author: {},
                            record: {},
                            bookmarkCount: 0,
                            replyCount: 2,
                            repostCount: 1,
                            likeCount: 7,
                            quoteCount: 0,
                            indexedAt: '2025-09-18T15:28:40.772Z',
                            viewer: {},
                            labels: [],
                            $type: 'app.bsky.feed.defs#postView',
                        },
                        parent: {
                            uri: 'at://did:plc:fz7okbhusu5f2gbzx5tyncgf/app.bsky.feed.post/3lz4r7p5kl22i',
                            cid: 'bafyreieq257qhrlhocdhgwz43kxz6xj3s6qfldsk7w3vrx6makoowuxawa',
                            author: {},
                            record: {},
                            bookmarkCount: 0,
                            replyCount: 1,
                            repostCount: 0,
                            likeCount: 3,
                            quoteCount: 0,
                            indexedAt: '2025-09-18T16:24:58.970Z',
                            viewer: {},
                            labels: [],
                            $type: 'app.bsky.feed.defs#postView',
                        },
                        grandparentAuthor: {
                            did: 'did:plc:qxichs7jsycphrsmbujwqbfb',
                            handle: 'evilbel.org',
                            displayName: 'isabel',
                            avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:qxichs7jsycphrsmbujwqbfb/bafkreihoahnlvtsazfe5cb55tl6mpdzi62f2esxdm2o23fsodihm3osile@jpeg',
                            associated: {},
                            viewer: {},
                            labels: [],
                            createdAt: '2023-07-22T15:40:32.670Z',
                        },
                    },
                },
            ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        handlerAgent = new HandlerAgent(
            'agentName',
            'testHandle',
            'testPassword',
            mockAtpAgent
        );
    });
    describe('getAuthorFeed', () => {
        it('getAuthorFeed gets Feed', async () => {
            mockAtpAgent.getAuthorFeed.mockResolvedValue(
                // @ts-ignore
                mockGetAuthorFeedResp
            );
            const resp = await handlerAgent.getAuthorFeed();

            expect(mockAtpAgent.getAuthorFeed).toHaveBeenCalledWith({
                actor: sessData.did,
            });
            expect(resp).toMatchObject(mockGetAuthorFeedResp.data);
        });
    });

    describe('getPostThread', () => {
        it('getPostThread gets post thread', async () => {
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getPostThread(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toMatchObject(mockGetPostThreadResp.data);
        });
    });

    describe('getPostReplies', () => {
        it('getPostReplies gets post replies', async () => {
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getPostReplies(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toMatchObject(
                mockGetPostThreadResp.data.thread.replies
            );
        });
    });

    describe('getPostThreadgate', () => {
        it('getPostThreadgate gets post threadgate', async () => {
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getPostThreadgate(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toMatchObject(mockGetPostThreadResp.data.threadgate);
        });
    });
});
