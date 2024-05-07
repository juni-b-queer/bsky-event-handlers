import { CreateSkeetMessage, HandlerAgent, JetstreamMessage } from '../../src';
import { AtpSessionData, BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string = 'testhandle';
    const testPassword: string = 'testpassword';
    let mockedAgent: BskyAgent;
    beforeEach(() => {
        mockedAgent = {
            session: {
                did: 'did:plc:bot',
            } as AtpSessionData,
        } as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
    });

    it('generateURIFromCreateMessage creates expected uri', () => {
        const message: CreateSkeetMessage = {
            cid: '',
            collection: '',
            opType: 'c',
            record: {
                $type: '',
                createdAt: '',
                subject: '',
            },
            seq: 0,
            did: 'did:example:12345',
            rkey: 'feed1',
            // other necessary fields...
        };
        const result = handlerAgent.generateURIFromCreateMessage(message);

        expect(result).toEqual(
            'at://did:example:12345/app.bsky.feed.post/feed1'
        );
    });

    describe('postedByAgent', () => {
        it('should return true when message is same did as bot', () => {
            let message = {
                did: 'did:plc:bot',
            } as unknown as JetstreamMessage;
            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(true);
        });

        it('should return false when message is not same did as bot', () => {
            let message = {
                did: 'did:plc:other',
            } as unknown as JetstreamMessage;
            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(false);
        });
    });

    describe('getPostReply', () => {
        it('should return reply from message', () => {
            let reply = {
                parent: {
                    uri: 'uri',
                    cid: 'cid',
                },
                root: {
                    uri: 'uri',
                    cid: 'cid',
                },
            };
            let message = {
                did: 'did:plc:bot',
                record: {
                    reply: reply,
                },
            } as unknown as CreateSkeetMessage;
            const result = handlerAgent.getPostReply(message);
            expect(result).toBe(reply);
        });
    });
});
