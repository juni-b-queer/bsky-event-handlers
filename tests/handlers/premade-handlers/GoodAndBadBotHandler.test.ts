import {
    BadBotHandler,
    GoodAndBadBotHandler,
    GoodBotHandler,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
} from '../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/GoodBad';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Good and Bad Bot Handler', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });

    let goodBotHandler: GoodBotHandler;
    let badBotHandler: BadBotHandler;
    let goodAndBadBotHandler: GoodAndBadBotHandler;
    // let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    const mockCreateSkeet = jest.fn();
    const mockHasPostReply = jest
        .fn()
        .mockImplementation((message: JetstreamEventCommit) => {
            return (
                // @ts-ignore
                'reply' in message.commit.record &&
                message.commit.record?.reply !== undefined
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
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await goodBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'Thank you 🥹',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodBotHandler Does run actions with input when post is reply to bot and good bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent, 'test');
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodBotHandler Does not run actions when post is reply to bot, but not good bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('test')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await goodBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply to bot', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo('did:plc:other')
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('GoodBotHandler Does not run actions when post is not reply', async () => {
            goodBotHandler = GoodBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await goodBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });

    describe('Bad Bot Handler', () => {
        it('BadBotHandler Does run actions with default when post is reply to bot and bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await badBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                "I'm sorry 😓",
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('BadBotHandler Does run actions with input when post is reply to bot and bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent, 'test');
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await badBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('BadBotHandler Does not run actions when post is reply to bot, but not bad bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await badBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply to bot', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo('did:plc:other')
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await badBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });

        it('BadBotHandler Does not run actions when post is not reply', async () => {
            badBotHandler = BadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await badBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });

    describe('Good And Bad Bot Handler', () => {
        it('GoodAndBadBotHandler Does run actions with default when post is reply to bot and bad bot', async () => {
            goodAndBadBotHandler = GoodAndBadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;
            await goodAndBadBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                "I'm sorry 😓",
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodAndBadBotHandler Does run actions with input when post is reply to bot and bad bot', async () => {
            goodAndBadBotHandler = GoodAndBadBotHandler.make(
                handlerAgent,
                undefined,
                'test'
            );
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodAndBadBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodAndBadBotHandler Runs actions when post is reply to bot, and good bot', async () => {
            goodAndBadBotHandler = GoodAndBadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodAndBadBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'Thank you 🥹',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodAndBadBotHandler Runs actions when post is reply to bot, and good bot', async () => {
            goodAndBadBotHandler = GoodAndBadBotHandler.make(
                handlerAgent,
                'test',
                undefined
            );
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo(botDid)
                                        .create()
                                )
                                .text('good bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodAndBadBotHandler.handle(undefined, message);
            expect(mockHasPostReply).toHaveBeenCalledWith(message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockCreateSkeet).toHaveBeenCalledWith(
                'test',
                handlerAgent.generateReplyFromMessage(message),
                undefined
            );
        });

        it('GoodAndBadBotHandler Does not run actions when post is not reply to bot', async () => {
            goodAndBadBotHandler = GoodAndBadBotHandler.make(handlerAgent);
            message = JetstreamEventFactory.factory()
                .fromDid('did:plc:other')
                .commit(
                    JetstreamCommitFactory.factory()
                        .record(
                            NewSkeetRecordFactory.factory()
                                .reply(
                                    ReplyFactory.factory()
                                        .replyTo('did:plc:other')
                                        .create()
                                )
                                .text('bad bot')
                                .create()
                        )
                        .create()
                )
                .create() as JetstreamEventCommit;

            await goodAndBadBotHandler.handle(undefined, message);
            expect(mockGetDidFromUri).toHaveBeenCalledWith(
                message?.commit?.record?.reply?.parent.uri
            );
            expect(mockHasPostReply).not.toHaveBeenCalled();
            expect(mockCreateSkeet).not.toHaveBeenCalled();
        });
    });
});
