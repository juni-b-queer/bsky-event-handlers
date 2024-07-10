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
    public restart: boolean = false;

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
        if (queryParams.length > 0) {
            this.setWsURL = `${this.wsURL}?${queryParams.join('&')}`;
        }
    }

    /**
     *
     */
    public createSubscription(): this {
        DebugLog.warn('FIREHOSE', `Initializing`);

        this.wsClient = new WebSocket(this.wsURL);

        this.wsClient.on('open', this.handleOpen);

        this.wsClient.on('message', this.handleMessage);

        this.wsClient.on('close', this.handleClose);

        this.wsClient.on('error', this.handleError);

        return this;
    }

    public handleMessage(data: WebSocket.RawData, isBinary: boolean) {
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
    }

    public handleOpen() {
        DebugLog.info('FIREHOSE', `Connection Opened`);
    }

    public handleClose() {
        DebugLog.error('JETSTREAM', 'Subscription Closed');
        this.wsClient?.close();
        if (this.restart) {
            DebugLog.warn('JETSTREAM', 'Subscription restarting in 5 seconds');
            setTimeout(() => {
                this.createSubscription();
                this.restart = false;
            }, 5000);
        }
    }

    // @ts-ignore
    public handleError(err) {
        DebugLog.error('FIREHOSE', `Error: ${err}`);
        this.restart = true;
    }

    public stopSubscription(): this {
        this.wsClient.close();
        this.restart = false;
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
