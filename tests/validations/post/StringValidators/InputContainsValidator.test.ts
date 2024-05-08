import {
    CreateSkeetMessage,
    HandlerAgent,
    InputContainsValidator,
    Subject,
} from '../../../../src';

describe('InputContainsValidator no strict parameter', () => {
    const validator = InputContainsValidator.make('test');
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
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

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'blahblahtestblahblah',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'message example',
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

describe('InputContainsValidator true strict parameter', () => {
    const validator = InputContainsValidator.make('test', true);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
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

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'blahblahtestblahblah',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'message example',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });

    test('shouldTrigger returns false if input does not match case sensitivity', async () => {
        const message: CreateSkeetMessage = {
            collection: 'app.bsky.feed.post',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'Test',
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
