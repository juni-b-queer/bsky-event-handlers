import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
    ReplyFactory,
} from '../../src';
import { AtpSessionData, BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string = 'testhandle';
    const testPassword: string = 'testpassword';
    let mockedAgent: BskyAgent;
    const botDid = 'did:plc:bot';
    beforeEach(() => {
        mockedAgent = {
            session: {
                did: botDid,
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
        const did = 'did:plc:12345';
        const rkey = 'rkeytest';
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid(did)
            .rkey(rkey)
            .create();
        const result = handlerAgent.generateURIFromCreateMessage(message);

        expect(result).toEqual(`at://${did}/app.bsky.feed.post/${rkey}`);
    });

    describe('postedByAgent', () => {
        it('should return true when message is same did as bot', () => {
            const message: JetstreamMessage = JetstreamMessageFactory.factory()
                .fromDid(botDid)
                .create();
            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(true);
        });

        it('should return false when message is not same did as bot', () => {
            const message: JetstreamMessage = JetstreamMessageFactory.factory()
                .fromDid('did:plc:other')
                .create();

            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(false);
        });
    });

    describe('getPostReply', () => {
        it('should return reply from message', () => {
            const reply = ReplyFactory.factory().create();
            const message: CreateSkeetMessage =
                CreateSkeetMessageFactory.factory()
                    .fromDid(botDid)
                    .record(
                        CreateSkeetRecordFactory.factory().reply(reply).create()
                    )
                    .create();
            const result = handlerAgent.getPostReply(message);
            expect(result).toBe(reply);
        });
    });
});
