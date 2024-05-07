import {
    BadBotHandler,
    CreateSkeetMessage,
    GoodBotHandler,
    HandlerAgent,
    OfflineHandler,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

describe('Good Bot Handler', () => {
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
    let handlerAgent: HandlerAgent = new HandlerAgent(
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
        offlineHandler = new OfflineHandler(handlerAgent, 'test');
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
                text: '!test',
            },
        };
        await offlineHandler.handle(message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'Bot functionality offline',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does run actions with input when post is command', async () => {
        offlineHandler = new OfflineHandler(handlerAgent, 'test', 'output');
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
                text: '!test',
            },
        };
        await offlineHandler.handle(message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(
            'output',
            handlerAgent.generateReplyFromMessage(message)
        );
    });

    it('OfflineHandler Does not run actions when post is not command', async () => {
        offlineHandler = new OfflineHandler(handlerAgent, 'test');
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
                text: 'blah',
            },
        };
        await offlineHandler.handle(message);
        expect(mockCreateSkeet).not.toHaveBeenCalled();
    });
});
