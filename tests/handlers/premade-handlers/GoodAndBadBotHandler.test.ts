import {
    BadBotHandler,
    CreateSkeetMessage,
    GoodBotHandler,
    HandlerAgent,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

describe('Good and Bad Bot Handler', () => {
    let goodBotHandler: GoodBotHandler;
    let badBotHandler: BadBotHandler;
    // let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const mockCreateSkeet = jest.fn();
    const mockHasPostReply = jest
        .fn()
        .mockImplementation((message: CreateSkeetMessage) => {
            return (
                'reply' in message.record && message.record?.reply !== undefined
            );
        });
    const mockGetDidFromUri = jest.fn().mockImplementation((uri: string) => {
        return (uri.match(/did:[^/]*/) || [])[0];
    });

    const bskyAgent: BskyAgent = {
        session: {
            did: 'did:plc:bot',
        },
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    beforeEach(() => {
        handlerAgent.createSkeet = mockCreateSkeet;
        handlerAgent.hasPostReply = mockHasPostReply;
        handlerAgent.getDIDFromUri = mockGetDidFromUri;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Good Bot Handler', () => {
        it('GoodBotHandler Does run actions with default when post is reply to bot and good bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        root: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                        parent: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                    },
                    text: 'good bot',
                },
            };
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'Thank you 🥹',
                handlerAgent.generateReplyFromMessage(message)
            );
        });

        it('GoodBotHandler Does run actions with input when post is reply to bot and good bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent, 'test');
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        root: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                        parent: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                    },
                    text: 'good bot',
                },
            };
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message)
            );
        });

        it('GoodBotHandler Does not run actions when post is reply to bot, but not good bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        parent: {
                            cid: 'cidRandom',
                            uri: 'at:/did:plc:bot/app.bsky.feed.post/blah',
                        },
                        root: {
                            cid: 'otherCIDrandom',
                            uri: 'at:/did:plc:random/app.bsky.feed.post/asdas',
                        },
                    },
                    text: 'test',
                },
            };
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply to bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        parent: {
                            cid: 'cidRandom',
                            uri: 'at:/did:plc:notbot/app.bsky.feed.post/blah',
                        },
                        root: {
                            cid: 'otherCIDrandom',
                            uri: 'at:/did:plc:random/app.bsky.feed.post/asdas',
                        },
                    },
                    text: 'test',
                },
            };
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    text: 'test',
                },
            };
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });

    describe('Bad Bot Handler', () => {
        it('BadBotHandler Does run actions with default when post is reply to bot and bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        root: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                        parent: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                    },
                    text: 'bad bot',
                },
            };
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                "I'm sorry 😓",
                handlerAgent.generateReplyFromMessage(message)
            );
        });

        it('BadBotHandler Does run actions with input when post is reply to bot and bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent, 'test');
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        root: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                        parent: {
                            cid: 'cid',
                            uri: 'at://did:plc:bot/app.bsky.feed.post/rkey',
                        },
                    },
                    text: 'bad bot',
                },
            };
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message)
            );
        });

        it('BadBotHandler Does not run actions when post is reply to bot, but not bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        parent: {
                            cid: 'cidRandom',
                            uri: 'at:/did:plc:bot/app.bsky.feed.post/blah',
                        },
                        root: {
                            cid: 'otherCIDrandom',
                            uri: 'at:/did:plc:random/app.bsky.feed.post/asdas',
                        },
                    },
                    text: 'test',
                },
            };
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply to bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    reply: {
                        parent: {
                            cid: 'cidRandom',
                            uri: 'at:/did:plc:notbot/app.bsky.feed.post/blah',
                        },
                        root: {
                            cid: 'otherCIDrandom',
                            uri: 'at:/did:plc:random/app.bsky.feed.post/asdas',
                        },
                    },
                    text: 'test',
                },
            };
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = {
                collection: 'app.bsky.feed.post',
                did: 'did:plc:notbot',
                opType: 'c',
                rkey: '',
                seq: 0,
                cid: 'cid',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '2024-04-19T19:07:11.878Z',
                    langs: ['en'],
                    text: 'test',
                },
            };
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });
});
