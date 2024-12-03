import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    OfflineHandler,
} from '../../../src';
import { BskyAgent } from '@atproto/api';
import fs from 'fs';
import dotenv from 'dotenv';

const sessPath = './tests/temp/handler/offline';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Offline Handler', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    let offlineHandler: OfflineHandler;
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

    it('OfflineHandler Does run actions with defaults when post is command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test');
        message = JetstreamEventFactory.factory()
            .fromDid('did:plc:other')
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        NewSkeetRecordFactory.factory().text('!test').create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'Bot functionality offline',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does run actions with input when post is command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test', 'output');
        message = JetstreamEventFactory.factory()
            .fromDid('did:plc:other')
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        NewSkeetRecordFactory.factory().text('test!').create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;
        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'output',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does not run actions when post is not command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test');
        message = JetstreamEventFactory.factory()
            .fromDid('did:plc:other')
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        NewSkeetRecordFactory.factory().text('blah').create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;
        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).not.toHaveBeenCalled();
    });
});
