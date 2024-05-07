import { CreateSkeetMessage, HandlerAgent } from '../../src';
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
                did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
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
});
