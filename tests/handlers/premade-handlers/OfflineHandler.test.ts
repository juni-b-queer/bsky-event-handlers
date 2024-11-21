import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
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
    fs.mkdirSync(sessPath);
    let offlineHandler: OfflineHandler;
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

    it('OfflineHandler Does run actions with defaults when post is command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test');
        message = CreateSkeetMessageFactory.factory()
            .record(CreateSkeetRecordFactory.factory().text('!test').create())
            .create();
        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'Bot functionality offline',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does run actions with input when post is command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test', 'output');
        message = CreateSkeetMessageFactory.factory()
            .record(CreateSkeetRecordFactory.factory().text('test!').create())
            .create();
        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'output',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does not run actions when post is not command', async () => {
        offlineHandler = OfflineHandler.make(handlerAgent, 'test');
        message = CreateSkeetMessageFactory.factory()
            .record(CreateSkeetRecordFactory.factory().text('blah').create())
            .create();
        await offlineHandler.handle(undefined, message);
        expect(mockCreateSkeet).not.toHaveBeenCalled();
    });
});
