import {
    CreateSkeetMessage,
    HandlerAgent,
    IsGoodBotValidator,
    Subject,
    CreateSkeetMessageFactory,
    CreateSkeetRecordFactory,
} from '../../src';
import { TestValidator } from '../../src';

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('TestValidator', () => {
    test('shouldTrigger returns true for true attribute', async () => {
        const validator = TestValidator.make(true);
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
        const validator = TestValidator.make(false);
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
