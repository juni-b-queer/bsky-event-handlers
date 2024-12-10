import { HandlerAgent, TestValidator } from '../../src';

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('TestValidator', () => {
    test('shouldTrigger returns true for true attribute', async () => {
        const validator = TestValidator.make(true);
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns false for false attribute', async () => {
        const validator = TestValidator.make(false);
        expect(await validator.shouldTrigger(mockAgent)).toBe(false);
    });
});
