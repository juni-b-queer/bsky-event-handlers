import {
    CreateMessageFactory,
    CreateSkeetMessage, CreateSkeetRecordFactory,
    HandlerAgent,
    IsGoodBotValidator, ReplyFactory,
    Subject
} from "../../../src";
import { BskyAgent } from '@atproto/api';

const botDid = 'did:plc:blah'
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
    const validator = IsGoodBotValidator.make();
    const botReply = ReplyFactory.factory().replyTo(botDid).create()
    const skeetRecord = CreateSkeetRecordFactory.factory().text('great bot').reply(botReply).create()

    it('shouldTrigger returns true for positive bot responses', async () => {
        const positiveMessage = CreateMessageFactory.factory().record(skeetRecord).create()
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            true
        );
    });

    it('shouldTrigger returns true for thank you', async () => {
        skeetRecord.text = 'ok thank you';
        const positiveMessage = CreateMessageFactory.factory().record(skeetRecord).create()
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            true
        );
    });

    it('shouldTrigger returns false for non-positive bot responses', async () => {
        skeetRecord.text = 'bad bot';
        const negativeMessage = CreateMessageFactory.factory().record(skeetRecord).create()
        expect(await validator.shouldTrigger(negativeMessage, mockAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non post collection', async () => {
        const positiveMessage: CreateSkeetMessage = {
            collection: 'app.bsky.feed.like',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'bad bot',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
                reply: {
                    root: {
                        cid: 'cid',
                        uri: 'at://did:plc:blah/app.bsky.feed.post/rkey',
                    },
                    parent: {
                        cid: 'cid',
                        uri: 'at://did:plc:blah/app.bsky.feed.post/rkey',
                    },
                },
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns false for non reply', async () => {
        skeetRecord.reply = undefined;
        const positiveMessage = CreateMessageFactory.factory().record(skeetRecord).create()
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            false
        );
    });
});
