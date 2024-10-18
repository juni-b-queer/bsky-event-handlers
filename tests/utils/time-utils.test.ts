import { advanceTo, clear } from 'jest-date-mock';
import {
    getHumanReadableDateTimeStamp,
    getTimezonesWhereItIsAGivenTime,
    isTimeInHHMMFormat,
    nowDateTime,
} from '../../src';
import moment from 'moment-timezone';

describe('getHumanReadableDateTimeStamp', () => {
    it('should return date time string in human readable format', () => {
        const datetime = '2023-11-30T15:31:00';
        const result = getHumanReadableDateTimeStamp(datetime);
        expect(result).toEqual(expect.any(String));
    });

    it('should handle incorrect datetime by throwing an error', () => {
        const datetime = 'incorrect-date-time';
        expect(getHumanReadableDateTimeStamp(datetime)).toBe('Invalid Date');
    });

    it('should correctly handle date times near midnight', () => {
        const datetime = '2023-11-30T23:59:59';
        const result = getHumanReadableDateTimeStamp(datetime);
        expect(result).toEqual(expect.any(String));
    });
});
describe('nowDateTime function', () => {
    beforeEach(() => {
        advanceTo(new Date(Date.UTC(2023, 3, 2, 19, 30, 0)));
    });
    afterEach(() => {
        clear();
    });

    it('should return the correct datetime string', () => {
        const result = nowDateTime();
        expect(result).toBe('4/2/2023, 02:30 PM');
    });
});

describe('getTimezonesWhereItIsAGivenTime', () => {
    const timeScenarios = [
        { time: '12:00', timezone: 'Etc/GMT' },
        { time: '02:30', timezone: 'Asia/Kolkata' },
        { time: '19:00', timezone: 'America/New_York' },
        { time: '09:00', timezone: 'Europe/Berlin' },
        { time: '06:00', timezone: 'Africa/Cairo' },
    ];

    timeScenarios.forEach((scenario, i) => {
        it(`should return correct timezones where it is a given time - scenario ${i + 1}`, () => {
            const dateWithZone = moment.tz(
                scenario.time,
                'HH:mm',
                scenario.timezone
            );
            advanceTo(dateWithZone.toDate());
            const result = getTimezonesWhereItIsAGivenTime(scenario.time);
            expect(result).toContain(scenario.timezone);
        });
    });
});

describe('isTimeInHHMMFormat', () => {
    it('should validate "HH:mm" time format correctly', () => {
        // Test data
        const validTimes = ['00:00', '23:59', '02:30', '14:45'];
        const invalidTimes = ['24:00', '00:60', '2:30', '14:5', 'invalid', ''];

        // Test the valid times
        for (const time of validTimes) {
            expect(isTimeInHHMMFormat(time)).toBe(true);
        }

        // Test the invalid times
        for (const time of invalidTimes) {
            const res: boolean = isTimeInHHMMFormat(time);
            console.log(`${res} ${time}`);
            expect(res).toBe(false);
        }
    });
});
