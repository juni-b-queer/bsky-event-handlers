import { AbstractValidator } from '../AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    getTimezonesWhereItIsAGivenTime,
    isTimeInHHMMFormat,
} from '../../utils/time-utils';
import { DebugLog } from '../../utils/DebugLog';

export class IsSpecifiedTimeValidator extends AbstractValidator {
    protected timezones: string[] = [];
    protected matchingTimezones: string[] = [];

    protected times: string[];
    constructor(...times: string[]) {
        super();
        this.times = times;
    }

    static make(...times: string[]): IsSpecifiedTimeValidator {
        return new IsSpecifiedTimeValidator(...times);
    }

    async handle(handlerAgent: HandlerAgent): Promise<boolean> {
        const timezones: { [key: string]: any; totalTimezones: number } = {
            totalTimezones: 0,
        };
        this.times.forEach((time) => {
            if (!isTimeInHHMMFormat(time)) {
                DebugLog.error(
                    'Time Validator',
                    `${time} is not in a valid format`
                );
                return;
            }

            timezones[time] = getTimezonesWhereItIsAGivenTime(time);
            timezones.totalTimezones =
                timezones.totalTimezones + timezones[time].length;
        });

        return timezones.totalTimezones > 0;
    }
}
