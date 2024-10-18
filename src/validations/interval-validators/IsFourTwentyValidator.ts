import { AbstractValidator } from '../AbstractValidator';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    getTimezonesWhereItIsAGivenTime,
    isTimeInHHMMFormat,
} from '../../utils/time-utils';
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
        const timezonesAM: string[] = getTimezonesWhereItIsAGivenTime('04:20');
        const timezonesPM: string[] = getTimezonesWhereItIsAGivenTime('16:20');
        return {
            timezonesAM: timezonesAM,
            timezonesPM: timezonesPM,
            totalTimezones: timezonesAM.length + timezonesPM.length,
        };
    }
}
