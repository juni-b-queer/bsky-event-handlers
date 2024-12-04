import {
    HandlerAgent,
    InputEqualsValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../../../src';

describe('InputEqualsValidator', () => {
    const validator = InputEqualsValidator.make('test');
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const createMessage = (text: string) => {
        return JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(NewSkeetRecordFactory.factory().text(text).create())
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    /**
     * Test: shouldTrigger returns true if input is trigger keyword
     * This test confirms that the validator correctly returns true when the input
     * matches the trigger keyword.
     */
    test('shouldTrigger returns true if input is trigger keyword', async () => {
        const message = createMessage('test');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    /**
     * Test: shouldTrigger returns false if input does not equal trigger keyword
     * This test confirms that the validator correctly returns false when the input
     * does not match the trigger keyword.
     */
    test('shouldTrigger returns false if input does not equal trigger keyword', async () => {
        const message = createMessage('message test');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
