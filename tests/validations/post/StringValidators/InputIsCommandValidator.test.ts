import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    InputIsCommandValidator,
} from '../../../../src';

describe('InputIsCommandValidator Class', () => {
    let inputIsCommandValidator: InputIsCommandValidator;
    let message: CreateSkeetMessage;
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    beforeEach(() => {
        inputIsCommandValidator = InputIsCommandValidator.make('key');
        message = CreateSkeetMessageFactory.factory()
            .withText('key! someCommand')
            .create();
    });

    it('should test shouldTrigger function - Prefix case', async () => {
        message.record.text = '!key someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = '!key';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'someCommand !key';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message.record.text = 'someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });

    it('should test shouldTrigger function - Suffix case', async () => {
        message.record.text = 'key! someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'key!';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'someCommand key!';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message.record.text = 'someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });
});

describe('InputIsCommandValidator Not strict Class', () => {
    let inputIsCommandValidator: InputIsCommandValidator;
    let message: CreateSkeetMessage;
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    beforeEach(() => {
        inputIsCommandValidator = InputIsCommandValidator.make('key', false);
        message = CreateSkeetMessageFactory.factory().withText('test').create();
    });

    it('should test shouldTrigger function - Prefix case', async () => {
        message.record.text = '!Key someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = '!keY';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'someCommand !key';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message.record.text = 'someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });

    it('should test shouldTrigger function - Suffix case', async () => {
        message.record.text = 'keY! someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'Key!';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message.record.text = 'someCommand key!';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message.record.text = 'someCommand';
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });
});
