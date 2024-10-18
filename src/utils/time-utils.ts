import moment from 'moment-timezone';

export function getHumanReadableDateTimeStamp(
    datetime: string,
    timezone: string = 'America/Chicago'
) {
    const dateObject = new Date(datetime);
    return dateObject.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: true, // Use 24-hour time format
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function nowDateTime() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        hour12: true, // Use 24-hour time format
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function getTimezonesWhereItIsAGivenTime(timeToCheck: string): string[] {
    const format = 'HH:mm';

    const allTimezones = moment.tz.names();
    const tz: string[] = [];

    allTimezones.forEach((timezone) => {
        const currentTimeInTimezone = moment.tz(timezone).format(format);
        if (currentTimeInTimezone === timeToCheck) {
            tz.push(timezone);
        }
    });

    return tz;
}

export function isTimeInHHMMFormat(time: string) {
    const pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return pattern.test(time);
}
