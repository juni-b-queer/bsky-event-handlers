import {
    HandlerAgent,
    IsBadBotValidator,
    JetstreamCollectionType,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
} from '../../../src';
import { BskyAgent } from '@atproto/api';
import fs from 'fs';
import dotenv from 'dotenv';

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

const createMessage = (
    text: string,
    collection: JetstreamCollectionType,
    replyToBot: boolean
) => {
    return JetstreamEventFactory.factory()
        .commit(
            JetstreamCommitFactory.factory()
                .operation('create')
                .collection(collection)
                .record(recordFactory(text, replyToBot))
                .create()
        )
        .create() as JetstreamEventCommit;
};

const recordFactory = (text: string, replyToBot: boolean) => {
    const record = NewSkeetRecordFactory.factory().text(text);

    if (replyToBot) {
        record.reply(ReplyFactory.factory().replyTo(botDid).create());
    }

    return record.create();
};

describe('IsBadBotValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });

    const validator = IsBadBotValidator.make();

    it('shouldTrigger returns true for negative bot responses', async () => {
        const negativeMessage = createMessage(
            'bad bot',
            'app.bsky.feed.post',
            true
        );
        expect(await validator.shouldTrigger(mockAgent, negativeMessage)).toBe(
            true
        );
    });

    it('shouldTrigger returns false for non-negative bot responses', async () => {
        const positiveMessage = createMessage(
            'goot bot',
            'app.bsky.feed.post',
            true
        );
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non post collection', async () => {
        const positiveMessage = createMessage(
            'bad bot',
            'app.bsky.feed.like',
            false
        );
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non reply', async () => {
        const negativeMessage = createMessage(
            'bad bot',
            'app.bsky.feed.post',
            false
        );
        expect(await validator.shouldTrigger(mockAgent, negativeMessage)).toBe(
            false
        );
    });
});
