import {
    CreateSkeetMessage,
    HandlerAgent,
    IsReplyValidator,
    Subject,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';

describe('IsReplyValidator', () => {
    const validator = IsReplyValidator.make();
    const bskyAgent: BskyAgent = {
        session: {
            did: 'did:plc:blah',
        },
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    test('shouldTrigger returns true if op.payload.reply is not null', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'test',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
                reply: {
                    parent: {
                        cid: 'test',
                        uri: 'test',
                    },
                    root: {
                        cid: 'test',
                        uri: 'test',
                    },
                },
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if op.payload.reply is null', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'test',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
