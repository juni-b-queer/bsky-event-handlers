import {
    AbstractValidator,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    TestValidator,
} from '../../../src';
import { AbstractMessageValidator } from '../../../src/validations/message-validators/AbstractMessageValidator';
import { TestMessageValidator } from '../../../src/validations/message-validators/TestMessageValidator';

const createMessage = () => {
    return JetstreamEventFactory.factory()
        .commit(
            JetstreamCommitFactory.factory()
                .operation('create')
                .collection('app.bsky.feed.post')
                .record(NewSkeetRecordFactory.factory().create())
                .create()
        )
        .create() as JetstreamEventCommit;
};

describe('Testing Negating', () => {
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const message = createMessage();

    test('shouldTrigger returns false if given validator is true', async () => {
        const testValidator: AbstractValidator = TestValidator.make(true).not();
        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger returns true if given validator is false', async () => {
        const testValidator: AbstractValidator =
            TestValidator.make(false).not();
        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            true
        );
    });
});

describe('Testing message Negating', () => {
    const handlerAgent: HandlerAgent = {} as HandlerAgent;
    const message = createMessage();

    test('shouldTrigger returns false if given validator is true', async () => {
        const testValidator: AbstractMessageValidator =
            TestMessageValidator.make(true).not();
        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger returns true if given validator is false', async () => {
        const testValidator: AbstractMessageValidator =
            TestMessageValidator.make(false).not();
        expect(await testValidator.shouldTrigger(handlerAgent, message)).toBe(
            true
        );
    });
});

describe('Test AbstractValidatorError', () => {
    test('make throws error on abstract', async () => {
        expect(AbstractValidator.make).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });
});

describe('Test AbstractMessageValidatorError', () => {
    test('make throws error on abstract', async () => {
        expect(AbstractMessageValidator.make).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });
});
