import WebSocket from "ws";
import { DebugLog } from "../../utils/DebugLog";
import {
  CreateSkeetMessage,
  JetstreamEvent,
  JetstreamEventCommit,
  JetstreamEventCommitCreate
} from "../../types/JetstreamTypes";
import { MessageHandler } from "../../handlers/message-handlers/MessageHandler";
import { AbstractSubscription } from "../AbstractSubscription";

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
  public restartDelay: number = 5; // seconds

  /**
   * Creates a new instance of the Firehose Subscription.
   *
   * @param {JetstreamSubscriptionHandlers} handlerControllers - An array of handler controllers.
   * @param {string} wsURL - The WebSocket URL to connect to. Defaults to `wss://bsky.network`.
   */
  constructor(
    protected handlerControllers: JetstreamSubscriptionHandlers,
    protected wsURL: string = "ws://localhost:6008/subscribe"
  ) {
    super(handlerControllers);
    this.generateWsURL();
    DebugLog.info("FIREHOSE", `Websocket URL: ${this.wsURL}`);
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
    if (queryParams.length > 0) {
      this.setWsURL = `${this.wsURL}?${queryParams.join("&")}`;
    }
  }

  /**
   *
   */
  public createSubscription(): this {
    DebugLog.warn("FIREHOSE", `Initializing`);

    this.wsClient = new WebSocket(this.wsURL);

    this.wsClient.on("open", this.handleOpen);

    this.wsClient.on(
      "message",
      (data: WebSocket.RawData, isBinary: boolean) => {
        const message = data.toString();
        // console.log(isBinary);
        if (typeof message === "string") {
          const event: JetstreamEvent = JSON.parse(message);
          console.log(event);
          if (event.kind === "commit") {
            switch (event.commit?.operation) {
              case "create":
                this.handleCreate(event as JetstreamEventCommit);
                break;
              case "delete":
                this.handleDelete(event as JetstreamEventCommitCreate);
                break;
            }
          }
        }
      }
    );

    this.wsClient.on("close", () => {
      DebugLog.error("JETSTREAM", "Subscription Closed");
      this.restart = true;
      this.wsClient?.close();
      if (this.restart) {
        DebugLog.warn(
          "JETSTREAM",
          "Subscription restarting in 5 seconds"
        );
        setTimeout(() => {
          this.createSubscription();
          this.restart = false;
        }, this.restartDelay * 1000);
      }
    });

    this.wsClient.on("error", (err) => {
      console.log(err);
      DebugLog.error("FIREHOSE", `Error: ${err.message}`);
      this.restart = true;
    });

    return this;
  }

  public handleOpen() {
    DebugLog.info("FIREHOSE", `Connection Opened`);
  }

  public stopSubscription(restart: boolean = false): this {
    this.wsClient.close();
    this.restart = restart;
    return this;
  }

  // TODO There has got to be a better way to do this, I'm just to high to do it now
  handleCreate(createEvent: JetstreamEventCommitCreate) {
    switch (createEvent.commit.collection) {
      case "app.bsky.feed.post":
        console.log("post");
        this.handlerControllers.post?.c?.forEach(
          // @ts-ignore
          (handler: MessageHandler) => {
            // TODO Update MessageHandler for new types
            handler.handle(
              undefined,
              createMessage as CreateSkeetMessage
            );
          }
        );
        break;
      case "app.bsky.feed.like":
        this.handlerControllers.like?.c?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, createMessage);
          }
        );
        break;
      case "app.bsky.feed.repost":
        this.handlerControllers.repost?.c?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, createMessage);
          }
        );
        break;
      case "app.bsky.graph.follow":
        this.handlerControllers.follow?.c?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, createMessage);
          }
        );
        break;
    }
  }

  handleDelete(deleteEvent: JetstreamEventCommit) {
    switch (deleteEvent.commit.collection) {
      case "app.bsky.feed.post":
        this.handlerControllers.post?.d?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, deleteMessage);
          }
        );
        break;
      case "app.bsky.feed.like":
        this.handlerControllers.like?.d?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, deleteMessage);
          }
        );
        break;
      case "app.bsky.feed.repost":
        this.handlerControllers.repost?.d?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, deleteMessage);
          }
        );
        break;
      case "app.bsky.graph.follow":
        this.handlerControllers.follow?.d?.forEach(
          (handler: MessageHandler) => {
            handler.handle(undefined, deleteMessage);
          }
        );
        break;
    }
  }
}
