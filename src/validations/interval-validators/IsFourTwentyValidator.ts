import { AbstractValidator } from '../AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import moment from 'moment-timezone';

export class IsFourTwentyValidator extends AbstractValidator {
    protected timezones: string[] = [];
    protected matchingTimezones: string[] = [];

    constructor() {
        super();
    }

    static make(): IsFourTwentyValidator {
        return new IsFourTwentyValidator();
    }

    async handle(handlerAgent: HandlerAgent): Promise<boolean> {
        const timezones =
            IsFourTwentyValidator.getTimezonesWhereItIsFourTwenty();

        return timezones.totalTimezones > 0;
    }

    static getTimezonesWhereItIsFourTwenty() {
        const timezonesAM: string[] =
            IsFourTwentyValidator.getTimezonesWhereItIsAGivenTime('04:20');
        const timezonesPM: string[] =
            IsFourTwentyValidator.getTimezonesWhereItIsAGivenTime('16:20');
        return {
            timezonesAM: timezonesAM,
            timezonesPM: timezonesPM,
            totalTimezones: timezonesAM.length + timezonesPM.length,
        };
    }

    static getTimezonesWhereItIsAGivenTime(timeToCheck: string): string[] {
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
}
