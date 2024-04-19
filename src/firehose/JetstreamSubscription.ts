import WebSocket from "ws";
import { DebugLog } from "../utils/DebugLog";
import {
  CreateMessage,
  CreateSkeetMessage,
  DeleteMessage,
} from "../types/JetstreamTypes";
import { CreateSkeetHandler } from "../handlers/record-handlers/skeet/CreateSkeetHandler";

export interface JetstreamSubscriptionHandlers {
  post?: {
    c?: CreateSkeetHandler[];
    d?: CreateSkeetHandler[];
  };
  like?: {
    c?: CreateSkeetHandler[];
    d?: CreateSkeetHandler[];
  };
  repost?: {
    c?: CreateSkeetHandler[];
    d?: CreateSkeetHandler[];
  };
  follow?: {
    c?: CreateSkeetHandler[];
    d?: CreateSkeetHandler[];
  };
}

export class JetstreamSubscription {
  //@ts-ignore
  private wsClient: WebSocket;
  public lastMessageTime: number | undefined;

  /**
   * Creates a new instance of the Firehose Subscription.
   *
   * @param {Array<HandlerController>} handlerControllers - An array of handler controllers.
   * @param options
   * @param {string} wsURL - The WebSocket URL to connect to. Defaults to `wss://bsky.network`.
   */
  constructor(
    private handlerControllers: JetstreamSubscriptionHandlers,
    private wsURL: string = "ws://localhost:6008/subscribe",
  ) {
    DebugLog.warn("FIREHOSE", `Initializing`);
    this.generateWsURL();
    DebugLog.info("FIREHOSE", `Websocket URL: ${this.wsURL}`);
    this.createSubscription();
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
   * Calculates the time elapsed since the last message was received.
   *
   * @return {number} The time elapsed in milliseconds since the last message was received. If the last message time is undefined, -1 is returned.
   */
  public timeSinceLastMessage() {
    if (this.lastMessageTime !== undefined) {
      const currentTime = Date.now();
      const diff = currentTime - this.lastMessageTime;
      DebugLog.info(
        "FIREHOSE",
        `Checking for restart. Time since last received message: ${diff}`,
      );
      return diff;
    } else {
      DebugLog.error("FIREHOSE", `LastMessageTime is undefined`);
      return -1;
    }
  }

  /**
   *
   */
  public createSubscription() {
    this.wsClient = new WebSocket(this.wsURL);

    this.wsClient.on("open", () => {
      DebugLog.info("FIREHOSE", `Connection Opened`);
    });

    this.wsClient.on("message", (data, isBinary) => {
      const message = !isBinary ? data : data.toString();
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

  handleCreate(createMessage: CreateMessage) {
    switch (createMessage.collection) {
      case "app.bsky.feed.post":
        // if(createMessage.record.embed){
        //     console.log(JSON.stringify(createMessage,null,2))
        // }
        this.handlerControllers.post?.c?.forEach(
          (handler: CreateSkeetHandler) => {
            handler.handle(createMessage as CreateSkeetMessage);
          },
        );
        // console.log(createMessage)
        break;
      case "app.bsky.feed.like":
        // console.log(collection)
        // console.log(createMessage)
        break;
      case "app.bsky.feed.repost":
        // console.log(collection)
        // console.log(createMessage)
        break;
      case "app.bsky.graph.follow":
        // console.log(collection)
        // console.log(createMessage)
        break;
    }
  }

  handleDelete(deleteMessage: DeleteMessage) {
    switch (deleteMessage.collection) {
      case "app.bsky.feed.post":
        // console.log(deleteMessage)
        break;
      case "app.bsky.feed.like":
        // console.log(collection)
        // console.log(deleteMessage)
        break;
      case "app.bsky.feed.repost":
        // console.log(collection)
        // console.log(deleteMessage)
        break;
      case "app.bsky.graph.follow":
        // console.log(collection)
        // console.log(deleteMessage)
        break;
    }
  }

  /**
   *
   */
  public restartSubscription() {}
}
