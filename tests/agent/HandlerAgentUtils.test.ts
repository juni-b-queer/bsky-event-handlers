import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamRecord,
    NewSkeetRecord,
    NewSkeetRecordFactory,
    ReplyFactory,
} from '../../src';
import { AtpSessionData, BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
process.env.SESSION_DATA_PATH = './tests/temp/utils';

jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    afterAll(() => {
        fs.rmSync('./tests/temp/utils', {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync('./tests/temp/utils', { recursive: true });
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
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(did)
            .commit(JetstreamCommitFactory.factory().rkey(rkey).create())
            .create() as JetstreamEventCommit;
        const result = handlerAgent.generateURIFromCreateMessage(message);

        expect(result).toEqual(`at://${did}/app.bsky.feed.post/${rkey}`);
    });

    describe('postedByAgent', () => {
        it('should return true when message is same did as bot', () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid(botDid)
                    .commit()
                    .create() as JetstreamEventCommit;
            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(true);
        });

        it('should return false when message is not same did as bot', () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid('did:plc:other')
                    .commit()
                    .create() as JetstreamEventCommit;

            const result = handlerAgent.postedByAgent(message);
            expect(result).toBe(false);
        });
    });

    describe('getPostReply', () => {
        it('should return reply from message', () => {
            const reply = ReplyFactory.factory().create();
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid('did:plc:other')
                    .commit(
                        JetstreamCommitFactory.factory()
                            .record(
                                NewSkeetRecordFactory.factory()
                                    .reply(reply)
                                    .create()
                            )
                            .create()
                    )
                    .create() as JetstreamEventCommit;
            const result = handlerAgent.getPostReply(message);
            expect(result).toBe(reply);
        });
    });

    // New test to cover the specific lines
    describe('special case for commit.record.subject being a string', () => {
        it('should return default structure when subject is a string', () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid('did:plc:other')
                    .commit(
                        JetstreamCommitFactory.factory()
                            .record({
                                subject: 'some string',
                            } as JetstreamRecord)
                            .create()
                    )
                    .create() as JetstreamEventCommit;

            const result = handlerAgent.generateReplyFromMessage(message); // Or whichever method is relevant
            expect(result).toEqual({
                root: {
                    uri: '',
                    cid: '',
                },
                parent: {
                    uri: '',
                    cid: '',
                },
            });
        });
    });
});
