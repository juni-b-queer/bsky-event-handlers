import {
    BadBotHandler,
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    GoodBotHandler,
    HandlerAgent,
    ReplyFactory,
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

    const botDid: string = 'did:plc:bot';
    const bskyAgent: BskyAgent = {
        session: {
            did: botDid,
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
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('good bot')
                        .create()
                )
                .create();
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
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('good bot')
                        .create()
                )
                .create();
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
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('test')
                        .create()
                )
                .create();
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply to bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(
                            ReplyFactory.factory()
                                .replyTo('did:plc:other')
                                .create()
                        )
                        .text('good bot')
                        .create()
                )
                .create();
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory().text('good bot').create()
                )
                .create();
            await goodBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });

    describe('Bad Bot Handler', () => {
        it('BadBotHandler Does run actions with default when post is reply to bot and bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('bad bot')
                        .create()
                )
                .create();
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
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('bad bot')
                        .create()
                )
                .create();
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
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('good bot')
                        .create()
                )
                .create();
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply to bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(
                            ReplyFactory.factory()
                                .replyTo('did:plc:other')
                                .create()
                        )
                        .text('bad bot')
                        .create()
                )
                .create();
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory().text('bad bot').create()
                )
                .create();
            await badBotHandler.handle(message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });
});
