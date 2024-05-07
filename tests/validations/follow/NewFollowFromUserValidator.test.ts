import {
    CreateMessage,
    HandlerAgent,
    NewFollowFromUserValidator,
    UserFollowedValidator,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

describe('New Follow From User Validator', () => {
    const bskyAgent: BskyAgent = {
        session: {
            did: 'did:plc:bot',
        },
    } as BskyAgent;
    const mockHandlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    it('shouldTrigger returns true if no did provided, and follow is by bot user', async () => {
        const validator = new NewFollowFromUserValidator();
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:bot',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            true
        );
    });

    it('shouldTrigger returns true if given did is same as message did', async () => {
        const validator = new NewFollowFromUserValidator('did:plc:test');
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:test',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if given did is different from message did', async () => {
        const validator = new NewFollowFromUserValidator('did:plc:test');
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:example',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if default bot did not follow did', async () => {
        const validator = new NewFollowFromUserValidator();
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:example',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if using deprecated UserFollowedValidator', async () => {
        const validator = new UserFollowedValidator();
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:bot',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if using deprecated UserFollowedValidator and given did differs', async () => {
        const validator = new UserFollowedValidator('did:plc:random');
        const message: CreateMessage = {
            collection: 'app.bsky.graph.follow',
            did: 'did:plc:bot',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                subject: 'did:plc:w2nzarhtgwsdvkqcu4dxmchr',
                $type: 'app.bsky.graph.follow',
                createdAt: '2024-04-20T01:01:01.001Z',
            },
        };

        expect(await validator.shouldTrigger(message, mockHandlerAgent)).toBe(
            false
        );
    });
});
