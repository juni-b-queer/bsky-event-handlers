import { AbstractSubscription } from './AbstractSubscription';
import { AbstractHandler } from '../handlers/AbstractHandler';

export interface IntervalSchemaInterface {
    intervalSeconds: number; // seconds
    handlers: AbstractHandler[];
}

export type IntervalSubscriptionHandlers = IntervalSchemaInterface[];

export class IntervalSubscription extends AbstractSubscription {
    protected _intervals: any[] = [];

    constructor(protected intervalHandlers: IntervalSubscriptionHandlers) {
        super(intervalHandlers);
    }

    get intervals() {
        return this._intervals;
    }

    createSubscription(): IntervalSubscription {
        this.intervalHandlers.forEach((intervalCollection) => {
            this._intervals.push(
                setInterval(async () => {
                    for (const handler of intervalCollection.handlers) {
                        await handler.handle(undefined);
                    }
                }, intervalCollection.intervalSeconds * 1000)
            );
        });
        return this;
    }

    stopSubscription(): IntervalSubscription {
        this.intervals.forEach((interval) => {
            clearInterval(interval);
        });
        this._intervals = [];
        return this;
    }
}
