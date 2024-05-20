import { CreateSkeetMessage, CreateSkeetMessageFactory, HandlerAgent, InputContainsValidator } from "../../../../src";

describe('InputContainsValidator no strict parameter', () => {
    const validator = InputContainsValidator.make('test');
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('test message').create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('blahblahtestblahblah').create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('message example').create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});

describe('InputContainsValidator true strict parameter', () => {
    const validator = InputContainsValidator.make('test', true);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('test message').create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('blahblahtestblahblah').create()
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('message example').create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });

    test('shouldTrigger returns false if input does not match case sensitivity', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withText('Test').create()
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
