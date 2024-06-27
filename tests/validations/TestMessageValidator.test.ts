import {
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
    HandlerAgent,
} from '../../src';
import { TestMessageValidator } from '../../src/validations/message-validators/TestMessageValidator';

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('TestMessageValidator', () => {
    test('shouldTrigger returns true for true attribute', async () => {
        const validator = TestMessageValidator.make(true);
        const positiveMessage = CreateSkeetMessageFactory.factory()
            .record(
                CreateSkeetRecordFactory.factory().text('great bot').create()
            )
            .create();
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            true
        );
    });

    test('shouldTrigger returns false for false attribute', async () => {
        const validator = TestMessageValidator.make(false);
        const positiveMessage = CreateSkeetMessageFactory.factory()
            .record(
                CreateSkeetRecordFactory.factory().text('great bot').create()
            )
            .create();
        expect(await validator.shouldTrigger(mockAgent, positiveMessage)).toBe(
            false
        );
    });
});
