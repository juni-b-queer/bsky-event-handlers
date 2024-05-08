import {
    CreateSkeetMessage,
    HandlerAgent,
    IsGoodBotValidator,
    Subject,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

const bskyAgent: BskyAgent = {
    session: {
        did: 'did:plc:blah',
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

    it('shouldTrigger returns true for positive bot responses', async () => {
        const positiveMessage: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: 'rkey',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'great bot',
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
            true
        );
    });

    it('shouldTrigger returns true for thank you', async () => {
        const positiveMessage: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'ok thank you',
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
            true
        );
    });

    it('shouldTrigger returns false for non-positive bot responses', async () => {
        const negativeMessage: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
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
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            false
        );
    });
});
