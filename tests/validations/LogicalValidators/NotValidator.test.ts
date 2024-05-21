import {
    AbstractValidator,
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
    TestValidator,
} from '../../../src';

describe('Testing Negating', () => {
    const handlerAgent: HandlerAgent = {} as HandlerAgent;
    const message: JetstreamMessage = JetstreamMessageFactory.make();

    test('shouldTrigger returns false if given validator is true', async () => {
        const testValidator: AbstractValidator = TestValidator.make(true).not();

        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger returns true if given validator is false', async () => {
        const testValidator: AbstractValidator = TestValidator.make(true).not();

        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});

describe('Test AbstractValidatorError', () => {
    const handlerAgent: HandlerAgent = {} as HandlerAgent;
    const message: JetstreamMessage = JetstreamMessageFactory.make();

    test('make throws error on abstract', async () => {
        expect(AbstractValidator.make).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });
});
