import {
    HandlerAgent,
    IsGoodBotValidator,
    JetstreamCollectionType,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
} from '../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/bot';
fs.mkdirSync(sessPath, { recursive: true });

dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

const botDid = 'did:plc:bot';
const bskyAgent: BskyAgent = {
    session: {
        did: botDid,
    },
} as BskyAgent;
const mockAgent: HandlerAgent = new HandlerAgent(
    'name',
    'handle',
    'password',
    bskyAgent
);

describe('IsGoodBotValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });

    const validator = IsGoodBotValidator.make();

    const createMessage = (
        text: string,
        reply: boolean = true,
        collection: JetstreamCollectionType = 'app.bsky.feed.post'
    ) => {
        const recordFactory = NewSkeetRecordFactory.factory().text(text);

        if (reply) {
            recordFactory.reply(
                ReplyFactory.factory().replyTo(botDid).create()
            );
        }

        return JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection(collection)
                    .record(recordFactory.create())
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    it('shouldTrigger returns true for positive bot responses', async () => {
        const positiveMessage = createMessage('great bot');
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            true
        );
    });

    it('shouldTrigger returns true for thank you', async () => {
        const positiveMessage = createMessage('ok thank you');
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            true
        );
    });

    it('shouldTrigger returns false for non-positive bot responses', async () => {
        const negativeMessage = createMessage('bad bot');
        expect(await validator.shouldTrigger(mockAgent, negativeMessage)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non post collection', async () => {
        const message = createMessage('bad bot', true, 'app.bsky.feed.like');
        expect(await validator.shouldTrigger(mockAgent, message)).toBe(false);
    });

    it('shouldTrigger returns false for non reply', async () => {
        const message = createMessage('great bot', false);
        expect(await validator.shouldTrigger(mockAgent, message)).toBe(false);
    });
});
