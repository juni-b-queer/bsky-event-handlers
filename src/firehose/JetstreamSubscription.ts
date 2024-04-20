import WebSocket from "ws";
import { DebugLog } from "../utils/DebugLog";
import {
  CreateMessage,
  CreateSkeetMessage,
  DeleteMessage,
} from "../types/JetstreamTypes";
import { CreateSkeetHandler } from "../handlers/record-handlers/skeet/CreateSkeetHandler";
import {MessageHandler} from "../handlers/record-handlers/AbstractMessageHandler";

export interface JetstreamSubscriptionHandlers {
  post?: {
    c?: CreateSkeetHandler[];
    d?: MessageHandler[]; // TODO
  };
  like?: {
    c?: MessageHandler[]; // TODO
    d?: MessageHandler[]; // TODO
  };
  repost?: {
    c?: MessageHandler[]; // TODO
    d?: MessageHandler[]; // TODO
  };
  follow?: {
    c?: MessageHandler[]; // TODO
    d?: MessageHandler[]; // TODO
  };
}

export class JetstreamSubscription {
  //@ts-ignore
  private wsClient: WebSocket;
  public lastMessageTime: number | undefined;

  /**
   * Creates a new instance of the Firehose Subscription.
   *
   * @param {JetstreamSubscriptionHandlers} handlerControllers - An array of handler controllers.
   * @param {string} wsURL - The WebSocket URL to connect to. Defaults to `wss://bsky.network`.
   */
  constructor(
    private handlerControllers: JetstreamSubscriptionHandlers,
    private wsURL: string = "ws://localhost:6008/subscribe",
  ) {
    this.generateWsURL();

  }

  public set setWsURL(url: string) {
    this.wsURL = url;
  }

  generateWsURL() {
    const properties = ["post", "like", "repost", "follow"];
    const queryParams: string[] = properties
      // @ts-ignore
      .filter((property) => Boolean(this.handlerControllers[property]))
      .map((property) => {
        const prefix = property === "follow" ? "graph" : "feed";
        return `wantedCollections=app.bsky.${prefix}.${property}`;
      });
    this.setWsURL = `${this.wsURL}?${queryParams.join("&")}`;
  }

  /**
   *
   */
  public createSubscription() {
    DebugLog.warn("FIREHOSE", `Initializing`);
    DebugLog.info("FIREHOSE", `Websocket URL: ${this.wsURL}`);
    this.wsClient = new WebSocket(this.wsURL);

    this.wsClient.on("open", () => {
      DebugLog.info("FIREHOSE", `Connection Opened`);
    });

    this.wsClient.on("message", (data, isBinary) => {
      const message = !isBinary ? data : data.toString();
      console.log(message)
      if (typeof message === "string") {
        const data = JSON.parse(message);
        switch (data.opType) {
          case "c":
            this.handleCreate(data as CreateMessage);
            break;
          case "d":
            this.handleDelete(data as DeleteMessage);
            break;
        }
      }
    });

    this.wsClient.on("close", () => {
      this.wsClient.close();
      this.createSubscription();
    });
  }

  // TODO There has got to be a better way to do this, I'm just to high to do it now
  handleCreate(createMessage: CreateMessage) {
    switch (createMessage.collection) {
      case "app.bsky.feed.post":
        this.handlerControllers.post?.c?.forEach(
          (handler: CreateSkeetHandler) => {
            handler.handle(createMessage as CreateSkeetMessage);
          },
        );
        break;
      case "app.bsky.feed.like":
        this.handlerControllers.like?.c?.forEach(
            (handler: MessageHandler) => {
              handler.handle(createMessage);
            },
        );
        break;
      case "app.bsky.feed.repost":
        this.handlerControllers.repost?.c?.forEach(
            (handler: MessageHandler) => {
              handler.handle(createMessage);
            },
        );
        break;
      case "app.bsky.graph.follow":
        this.handlerControllers.follow?.c?.forEach(
            (handler: MessageHandler) => {
              handler.handle(createMessage);
            },
        );
        break;
    }
  }

  handleDelete(deleteMessage: DeleteMessage) {
    switch (deleteMessage.collection) {
      case "app.bsky.feed.post":
        this.handlerControllers.post?.d?.forEach(
            (handler: MessageHandler) => {
              handler.handle(deleteMessage);
            },
        );
        break;
      case "app.bsky.feed.like":
        this.handlerControllers.like?.d?.forEach(
            (handler: MessageHandler) => {
              handler.handle(deleteMessage);
            },
        );
        break;
      case "app.bsky.feed.repost":
        this.handlerControllers.repost?.d?.forEach(
            (handler: MessageHandler) => {
              handler.handle(deleteMessage);
            },
        );
        break;
      case "app.bsky.graph.follow":
        this.handlerControllers.follow?.d?.forEach(
            (handler: MessageHandler) => {
              handler.handle(deleteMessage);
            },
        );
        break;
    }
  }

  /**
   *
   */
  public restartSubscription() {}
}
