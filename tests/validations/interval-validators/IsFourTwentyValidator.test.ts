import { advanceTo, clear } from 'jest-date-mock';
import { HandlerAgent, IsFourTwentyValidator } from '../../../src';
const mockAgent: HandlerAgent = {} as HandlerAgent;

describe('IsFourTwentyValidator', () => {
    afterAll(() => {
        clear(); // Clear the mock
    });
    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T16:20:00'));
        const validator = IsFourTwentyValidator.make();
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T14:20:00'));
        const validator = IsFourTwentyValidator.make();
        expect(await validator.shouldTrigger(mockAgent)).toBe(true);
    });

    test('shouldTrigger returns false if it is not 4:20 AM/PM anywhere', async () => {
        // Advance to a time where it's not 4:20 anywhere in the world
        advanceTo(new Date('2024-01-16T14:00:00'));
        const validator = IsFourTwentyValidator.make();
        expect(await validator.shouldTrigger(mockAgent)).toBe(false);
    });
});

describe('IsFourTwentyValidator getTimezonesWhereItIsFourTwenty', () => {
    afterAll(() => {
        clear(); // Clear the mock
    });
    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T16:20:00'));
        const timezones =
            IsFourTwentyValidator.getTimezonesWhereItIsFourTwenty();
        console.log(timezones);
        expect(timezones.totalTimezones).toBe(47);
    });

    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T15:20:00'));
        const timezones =
            IsFourTwentyValidator.getTimezonesWhereItIsFourTwenty();
        console.log(timezones);
        expect(timezones.totalTimezones).toBe(63);
    });

    test('shouldTrigger returns true if it is 4:20 AM/PM somewhere', async () => {
        advanceTo(new Date('2024-01-16T14:20:00'));
        const timezones =
            IsFourTwentyValidator.getTimezonesWhereItIsFourTwenty();
        console.log(timezones);
        expect(timezones.totalTimezones).toBe(68);
    });
});
