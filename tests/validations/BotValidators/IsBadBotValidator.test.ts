import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
    IsBadBotValidator,
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
describe('IsBadBotValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });

    const validator = IsBadBotValidator.make();

    it('shouldTrigger returns true for negative bot responses', async () => {
        const negativeMessage: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('bad bot')
                        .create()
                )
                .create();
        expect(await validator.shouldTrigger(mockAgent, negativeMessage)).toBe(
            true
        );
    });

    it('shouldTrigger returns false for non-negative bot responses', async () => {
        const positiveMessage: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('good bot')
                        .create()
                )
                .create();
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non post collection', async () => {
        const positiveMessage: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory()
                        .reply(ReplyFactory.factory().replyTo(botDid).create())
                        .text('bad bot')
                        .create()
                )
                .collection('app.bsky.feed.like')
                .create();
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non reply', async () => {
        const negativeMessage: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory()
                .record(
                    CreateSkeetRecordFactory.factory().text('bad bot').create()
                )
                .create();
        expect(await validator.shouldTrigger(mockAgent, negativeMessage)).toBe(
            false
        );
    });
});
