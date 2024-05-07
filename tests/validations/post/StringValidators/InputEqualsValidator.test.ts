import {
    CreateSkeetMessage,
    HandlerAgent,
    InputEqualsValidator,
    Subject,
} from '../../../../src';

describe('InputEqualsValidator', () => {
    const validator = new InputEqualsValidator('test');
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    /**
     * Test: shouldTrigger returns true if input is trigger keyword
     * This test confirms that the validator correctly returns true when the input
     * matches the trigger keyword.
     */
    test('shouldTrigger returns true if input is trigger keyword', async () => {
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

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    /**
     * Test: shouldTrigger returns false if input does not equal trigger keyword
     * This test confirms that the validator correctly returns false when the input
     * does not match the trigger keyword.
     */
    test('shouldTrigger returns false if input does not equal trigger keyword', async () => {
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
});
