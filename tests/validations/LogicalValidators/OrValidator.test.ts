import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
    InputEqualsValidator,
    InputStartsWithValidator,
    OrValidator
} from "../../../src";

describe('OrValidator', () => {
    const key = 'test';
    const startsWithKeyValidator = InputStartsWithValidator.make('test');
    const equalsKeyValidator = InputEqualsValidator.make('test');
    const orValidator = OrValidator.make([
        startsWithKeyValidator,
        equalsKeyValidator,
    ]);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if both validators pass', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().record(CreateSkeetRecordFactory.factory().text('test').create()).create()
        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            true
        );
    });

    test('shouldTrigger returns true if one validator passes', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().record(CreateSkeetRecordFactory.factory().text('test message').create()).create()
        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            true
        );
    });

    test('shouldTrigger returns false if no validators pass', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().record(CreateSkeetRecordFactory.factory().text('random').create()).create()
        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
