import { CreateSkeetMessage, CreateSkeetMessageFactory, HandlerAgent, InputEqualsValidator } from "../../../../src";

describe('InputEqualsValidator', () => {
    const validator = InputEqualsValidator.make('test');
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    /**
     * Test: shouldTrigger returns true if input is trigger keyword
     * This test confirms that the validator correctly returns true when the input
     * matches the trigger keyword.
     */
    test('shouldTrigger returns true if input is trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('test').create()
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    /**
     * Test: shouldTrigger returns false if input does not equal trigger keyword
     * This test confirms that the validator correctly returns false when the input
     * does not match the trigger keyword.
     */
    test('shouldTrigger returns false if input does not equal trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('message test').create()
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
