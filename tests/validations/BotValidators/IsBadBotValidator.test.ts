import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
    IsBadBotValidator,
    ReplyFactory,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

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
        expect(await validator.shouldTrigger(negativeMessage, mockAgent)).toBe(
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
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
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
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
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
        expect(await validator.shouldTrigger(negativeMessage, mockAgent)).toBe(
            false
        );
    });
});
