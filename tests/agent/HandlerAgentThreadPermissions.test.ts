import { AtpAgent } from '@atproto/api';
import { mockDeep } from 'jest-mock-extended';
import { HandlerAgent } from '../../src';

describe('HandlerAgentThreadPermissions', () => {
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

    beforeEach(() => {
        jest.clearAllMocks();

        handlerAgent = new HandlerAgent(
            'agentName',
            'testHandle',
            'testPassword',
            mockAtpAgent
        );
    });

    describe('getAgentCanReply', () => {
        it('getAgentCanReply returns true when replyDisabled is false', async () => {
            mockGetPostThreadResp.data.thread.post.viewer.replyDisabled = false;
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getAgentCanReply(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toBe(true);
        });

        it('getAgentCanReply returns false when replyDisabled is true', async () => {
            mockGetPostThreadResp.data.thread.post.viewer.replyDisabled = true;
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getAgentCanReply(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toBe(false);
        });
    });

    describe('getAgentCanQuote', () => {
        it('getAgentCanQuote returns true when embeddingDisabled is false', async () => {
            mockGetPostThreadResp.data.thread.post.viewer.embeddingDisabled =
                false;
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getAgentCanQuote(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toBe(true);
        });

        it('getAgentCanQuote returns false when embeddingDisabled is true', async () => {
            mockGetPostThreadResp.data.thread.post.viewer.embeddingDisabled =
                true;
            mockAtpAgent.getPostThread.mockResolvedValue(
                // @ts-ignore
                mockGetPostThreadResp
            );
            const resp = await handlerAgent.getAgentCanQuote(postUri);

            expect(mockAtpAgent.getPostThread).toHaveBeenCalledWith({
                uri: postUri,
            });
            expect(resp).toBe(false);
        });
    });
});
