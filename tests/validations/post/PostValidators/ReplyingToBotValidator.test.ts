import {
    CreateSkeetMessage,
    HandlerAgent,
    ReplyingToBotValidator,
    Subject,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';

describe('ReplyingToBotValidator', () => {
    const validator = new ReplyingToBotValidator();

    it('shouldTrigger returns false if no reply', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
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

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if the did is the same as the agent', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
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

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    it('shouldTrigger returns false if the did in the reply.parent.uri is not the same as the agent details', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: 'did:plc:bad',
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
        const bskyAgent: BskyAgent = {
            session: {
                did: 'did:plc:bad',
            },
        } as BskyAgent;
        const handlerAgent: HandlerAgent = new HandlerAgent(
            'name',
            'handle',
            'password',
            bskyAgent
        );

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
