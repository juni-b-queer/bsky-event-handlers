import {AbstractHandler} from "../handlers/AbstractHandler";
import {AbstractSubscription} from "./AbstractSubscription";

export interface WebhookSchemaInterface {
    webhookPath: string; // seconds
    handlers: AbstractHandler[];
}

export type WebhookSubscriptionConfig = WebhookSchemaInterface[];

export class WebhookSubscription extends AbstractSubscription {
    protected _webhooks: any[] = [];

    constructor(protected webhookSubscriptionConfig: WebhookSubscriptionConfig) {
        super(webhookSubscriptionConfig);
    }

    get webhooks() {
        return this._webhooks;
    }

    createSubscription(): WebhookSubscription {
        // TODO start subscription
        return this;
    }

    stopSubscription(): WebhookSubscription {
        // TODO Stop subscription
        return this;
    }
}