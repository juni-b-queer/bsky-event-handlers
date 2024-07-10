import { AbstractHandler } from '../handlers/AbstractHandler';
import { JetstreamSubscriptionHandlers } from './firehose/JetstreamSubscription';
import { IntervalSubscriptionHandlers } from './IntervalSubscription';

export abstract class AbstractSubscription {
    constructor(
        protected handlers:
            | JetstreamSubscriptionHandlers
            | IntervalSubscriptionHandlers
            | AbstractHandler[]
    ) {}

    abstract createSubscription(): AbstractSubscription;

    abstract stopSubscription(): AbstractSubscription;

    restartSubscription(): AbstractSubscription {
        this.stopSubscription();
        this.createSubscription();
        return this;
    }
}
