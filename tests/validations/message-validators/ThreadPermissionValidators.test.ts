import dotenv from 'dotenv';
import fs from 'fs';
import {
    CanQuoteThreadValidator,
    CanReplyToThreadValidator,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../src';
import { mockDeep } from 'jest-mock-extended';
import { AtpAgent } from '@atproto/api';

const sessPath = './tests/temp/val/post/ThreadPermissionValidators';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Can Reply to Thread Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const postUri = 'at://did:plc:user/app.bsky.feed.post/otherRkey';
    const validator = CanReplyToThreadValidator.make(postUri);
    const atpAgent = mockDeep<AtpAgent>();
    Object.defineProperty(atpAgent, 'session', {
        value: {
            did: 'did:plc:mockdid',
            handle: 'mockhandle.test',
            email: 'mock@example.com',
            emailConfirmed: true,
            accessJwt: 'mock-access-jwt',
            refreshJwt: 'mock-refresh-jwt',
        },
        writable: false,
    });
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        atpAgent
    );

    const message = JetstreamEventFactory.factory()
        .fromDid('did:plc:other')
        .commit(
            JetstreamCommitFactory.factory()
                .operation('create')
                .collection('app.bsky.feed.post')
                .record(NewSkeetRecordFactory.factory().create())
                .create()
        )
        .create() as JetstreamEventCommit;

    it('shouldTrigger returns true if canReply returns true', async () => {
        // @ts-ignore
        atpAgent!.getPostThread.mockResolvedValue({
            data: {
                thread: {
                    // @ts-ignore
                    post: {
                        viewer: {
                            replyDisabled: false,
                        },
                    },
                },
                threadgate: {},
            },
            success: true,
        });

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if canReply returns false', async () => {
        // @ts-ignore
        atpAgent!.getPostThread.mockResolvedValue({
            data: {
                thread: {
                    // @ts-ignore
                    post: {
                        viewer: {
                            replyDisabled: true,
                        },
                    },
                },
                threadgate: {},
            },
            success: true,
        });

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});

describe('Can Quote Thread Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const postUri = 'at://did:plc:user/app.bsky.feed.post/otherRkey';
    const validator = CanQuoteThreadValidator.make(postUri);
    const atpAgent = mockDeep<AtpAgent>();
    Object.defineProperty(atpAgent, 'session', {
        value: {
            did: 'did:plc:mockdid',
            handle: 'mockhandle.test',
            email: 'mock@example.com',
            emailConfirmed: true,
            accessJwt: 'mock-access-jwt',
            refreshJwt: 'mock-refresh-jwt',
        },
        writable: false,
    });
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        atpAgent
    );

    const message = JetstreamEventFactory.factory()
        .fromDid('did:plc:other')
        .commit(
            JetstreamCommitFactory.factory()
                .operation('create')
                .collection('app.bsky.feed.post')
                .record(NewSkeetRecordFactory.factory().create())
                .create()
        )
        .create() as JetstreamEventCommit;

    it('shouldTrigger returns true if canQuote returns true', async () => {
        // @ts-ignore
        atpAgent!.getPostThread.mockResolvedValue({
            data: {
                thread: {
                    // @ts-ignore
                    post: {
                        viewer: {
                            embeddingDisabled: false,
                        },
                    },
                },
                threadgate: {},
            },
            success: true,
        });

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if canQuote returns false', async () => {
        // @ts-ignore
        atpAgent!.getPostThread.mockResolvedValue({
            data: {
                thread: {
                    // @ts-ignore
                    post: {
                        viewer: {
                            embeddingDisabled: true,
                        },
                    },
                },
                threadgate: {},
            },
            success: true,
        });

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
