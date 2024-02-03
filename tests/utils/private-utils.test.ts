import {sleep} from "../../src/utils/private-utils";

describe('sleep function', () => {
    // This test verifies the sleep function correctly waits for the specified duration
    test('sleeps for specified duration', async () => {
        const sleepTime = 1000; // 1 second
        const lowerBound = Date.now();

        await sleep(sleepTime);

        const difference = Date.now() - lowerBound;
        // We compare the difference with sleepTime, taking into account that actual time difference could be more than sleepTime due to the nature of setTimeout
        expect(difference).toBeGreaterThanOrEqual(sleepTime-1);
    });
});