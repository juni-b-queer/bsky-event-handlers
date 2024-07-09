import WebSocket from 'ws';
import { DebugLog } from '../../utils/DebugLog';
import {
    CreateMessage,
    CreateSkeetMessage,
    DeleteMessage,
} from '../../types/JetstreamTypes';
import { MessageHandler } from '../../handlers/message-handlers/MessageHandler';
import { AbstractSubscription } from '../AbstractSubscription';

export interface CreateAndDeleteHandlersInterface {
    c?: MessageHandler[];
    d?: MessageHandler[];
}
export interface JetstreamSubscriptionHandlers {
    post?: CreateAndDeleteHandlersInterface;
    like?: CreateAndDeleteHandlersInterface;
    repost?: CreateAndDeleteHandlersInterface;
    follow?: CreateAndDeleteHandlersInterface;
}

export class JetstreamSubscription extends AbstractSubscription {
    //@ts-ignore
    public wsClient: WebSocket;
    public lastMessageTime: number | undefined;

    /**
     * Creates a new instance of the Firehose Subscription.
     *
     * @param {JetstreamSubscriptionHandlers} handlerControllers - An array of handler controllers.
     * @param {string} wsURL - The WebSocket URL to connect to. Defaults to `wss://bsky.network`.
     */
    constructor(
        protected handlerControllers: JetstreamSubscriptionHandlers,
        protected wsURL: string = 'ws://localhost:6008/subscribe'
    ) {
        super(handlerControllers);
        this.generateWsURL();
        DebugLog.info('FIREHOSE', `Websocket URL: ${this.wsURL}`);
    }

    public set setWsURL(url: string) {
        this.wsURL = url;
    }

    generateWsURL() {
        const properties = ['post', 'like', 'repost', 'follow'];
        const queryParams: string[] = properties
            // @ts-ignore
            .filter((property) => Boolean(this.handlerControllers[property]))
            .map((property) => {
                const prefix = property === 'follow' ? 'graph' : 'feed';
                return `wantedCollections=app.bsky.${prefix}.${property}`;
            });
        this.setWsURL = `${this.wsURL}?${queryParams.join('&')}`;
    }

    /**
     *
     */
    public createSubscription(): this {
        DebugLog.warn('FIREHOSE', `Initializing`);

        this.wsClient = new WebSocket(this.wsURL);

        this.wsClient.on('open', () => {
            DebugLog.info('FIREHOSE', `Connection Opened`);
        });

        this.wsClient.on('message', (data, isBinary) => {
            const message = !isBinary ? data : data.toString();
            if (typeof message === 'string') {
                const data = JSON.parse(message);
                switch (data.opType) {
                    case 'c':
                        this.handleCreate(data as CreateMessage);
                        break;
                    case 'd':
                        this.handleDelete(data as DeleteMessage);
                        break;
                }
            }
        });

        this.wsClient.on('close', () => {
            DebugLog.error('JETSTREAM', 'Subscription Closed');
            this.wsClient.close();
            setTimeout(() => {
                this.createSubscription();
            }, 5000);
        });

        return this;
    }

    public stopSubscription(): this {
        this.wsClient.close();
        return this;
    }

    // TODO There has got to be a better way to do this, I'm just to high to do it now
    handleCreate(createMessage: CreateMessage) {
        switch (createMessage.collection) {
            case 'app.bsky.feed.post':
                this.handlerControllers.post?.c?.forEach(
                    // @ts-ignore
                    (handler: MessageHandler) => {
                        handler.handle(
                            undefined,
                            createMessage as CreateSkeetMessage
                        );
                    }
                );
                break;
            case 'app.bsky.feed.like':
                this.handlerControllers.like?.c?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, createMessage);
                    }
                );
                break;
            case 'app.bsky.feed.repost':
                this.handlerControllers.repost?.c?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, createMessage);
                    }
                );
                break;
            case 'app.bsky.graph.follow':
                this.handlerControllers.follow?.c?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, createMessage);
                    }
                );
                break;
        }
    }

    handleDelete(deleteMessage: DeleteMessage) {
        switch (deleteMessage.collection) {
            case 'app.bsky.feed.post':
                this.handlerControllers.post?.d?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, deleteMessage);
                    }
                );
                break;
            case 'app.bsky.feed.like':
                this.handlerControllers.like?.d?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, deleteMessage);
                    }
                );
                break;
            case 'app.bsky.feed.repost':
                this.handlerControllers.repost?.d?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, deleteMessage);
                    }
                );
                break;
            case 'app.bsky.graph.follow':
                this.handlerControllers.follow?.d?.forEach(
                    (handler: MessageHandler) => {
                        handler.handle(undefined, deleteMessage);
                    }
                );
                break;
        }
    }
}
