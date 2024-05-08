import {
    CreateSkeetMessage,
    HandlerAgent,
    InputStartsWithValidator,
    Subject,
} from '../../../../src';

describe('InputStartsWithValidator', () => {
    const validator = InputStartsWithValidator.make('test');
    const strictValidator = InputStartsWithValidator.make('test', true);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input starts with trigger keyword', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'test message',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if input does not start with trigger keyword', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'message test',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });

    test('shouldTrigger in strict mode returns true only if input strictly starts with trigger keyword', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'Test message',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await strictValidator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
