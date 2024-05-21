import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    InputStartsWithValidator,
} from '../../../../src';

describe('InputStartsWithValidator', () => {
    const validator = InputStartsWithValidator.make('test');
    const strictValidator = InputStartsWithValidator.make('test', true);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input starts with trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withText('test message')
            .create();
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if input does not start with trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withText('message test')
            .create();
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger in strict mode returns true only if input strictly starts with trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withText('Test message')
            .create();
        expect(await strictValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
