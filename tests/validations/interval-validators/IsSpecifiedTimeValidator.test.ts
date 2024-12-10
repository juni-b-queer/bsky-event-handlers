import { advanceTo, clear } from 'jest-date-mock';
import { DebugLog, HandlerAgent, IsSpecifiedTimeValidator } from '../../../src';

const mockAgent: HandlerAgent = {} as HandlerAgent;

describe('IsSpecifiedTimeValidator', () => {
    afterAll(() => {
        clear(); // Clear the mock
    });
    test('shouldTrigger returns true if it is 4:20 AM somewhere', async () => {
        advanceTo(new Date('2024-01-16T16:20:00'));
        const validator = IsSpecifiedTimeValidator.make('04:20');
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns true if it is 6:20 AM somewhere', async () => {
        advanceTo(new Date('2024-01-16T14:20:00'));
        const validator = IsSpecifiedTimeValidator.make('06:20');
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T14:20:00'));
        const validator = IsSpecifiedTimeValidator.make('04:20', '16:20');
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns false if it is not 6:20 AM anywhere', async () => {
        // Advance to a time where it's not 4:20 anywhere in the world
        advanceTo(new Date('2024-01-16T14:21:00'));
        const validator = IsSpecifiedTimeValidator.make('06:20');
        expect(await validator.shouldTrigger(mockAgent)).toBe(false);
    });

    test('shouldTrigger returns false if it is not 6:20 AM anywhere', async () => {
        // Advance to a time where it's not 4:20 anywhere in the world
        advanceTo(new Date('2024-01-16T14:21:00'));
        const mockError = jest.fn();
        DebugLog.error = mockError;
        const validator = IsSpecifiedTimeValidator.make('invalid');
        expect(await validator.shouldTrigger(mockAgent)).toBe(false);
        expect(mockError).toHaveBeenCalledWith(
            'Time Validator',
            'invalid is not in a valid format'
        );
    });
});
