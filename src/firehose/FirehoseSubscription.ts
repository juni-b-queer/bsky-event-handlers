import { HandlerController } from "../handlers/HandlerController";
import {
  subscribeRepos,
  SubscribeReposMessage,
  XrpcEventStreamClient,
} from "atproto-firehose";
import { AppBskyFeedPost, ComAtprotoSyncSubscribeRepos } from "@atproto/api";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { debugLog } from "../utils/logging-utils";

export class FirehoseSubscription {
  private firehoseClient: XrpcEventStreamClient;
  public lastMessageTime: number | undefined;

  /**
   * Creates a new instance of the Firehose Subscription.
   *
   * @param {Array<HandlerController>} handlerControllers - An array of handler controllers.
   * @param {string} wsURL - The WebSocket URL to connect to. Defaults to `wss://bsky.network`.
   * @param {number} maxTimeBetweenMessages - The maximum time (in milliseconds) allowed between messages. Defaults to 150.
   */
  constructor(
    private handlerControllers: Array<HandlerController>,
    private maxTimeBetweenMessages: number = 150,
    private checkSubscriptionInterval: number = 100,
    private wsURL: string = "wss://bsky.network",
  ) {
    debugLog("FIREHOSE", `Initializing`);
    debugLog("FIREHOSE", `Time between messages: ${maxTimeBetweenMessages}`);
    debugLog("FIREHOSE", `Websocket URL: ${wsURL}`);
    this.firehoseClient = subscribeRepos(wsURL, { decodeRepoOps: true });
    this.createSubscription();
    debugLog("FIREHOSE", `Initialized`);

    // @ts-ignore
    setInterval(async () => {
      this.checkForRestart();
    }, 60 * checkSubscriptionInterval);
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
      debugLog(
        "FIREHOSE",
        `Checking for restart. Time since last received message: ${diff}`,
      );
      return diff;
    } else {
      debugLog("FIREHOSE", `LastMessageTime is undefined`, 'error');
      return -1;
    }
  }

  /**
   * Checks if the time since the last message received is greater than the maximum allowed time between messages.
   * If the condition is true, it restarts the subscription.
   *
   * @return {void}
   */
  public checkForRestart() {
    if (this.timeSinceLastMessage() > this.maxTimeBetweenMessages) {
      this.restartSubscription();
    }
  }

  /**
   * Creates a subscription and sets up event listeners to handle incoming messages.
   * Filters `this.handlerControllers` into two arrays titled `isReply` and `isNotReply`.
   * Sets `this.lastMessageTime` to the current timestamp on each message  received
   * Listens for 'message' events from `this.firehoseClient` and executes the provided callback function.
   * Filters the `SubscribeReposMessage` objects that are of type 'app.bsky.feed.post' and handles them accordingly.
   * Calls the `handle` function of each HandlerController in `isReply` for messages with a reply payload, and
   * calls the `handle` function of each HandlerController in `isNotReply` for all other messages.
   */
  public createSubscription() {
    // filter this.handlerControllers into two arrays titled isReply and isNotReply
    const isReply = this.handlerControllers.filter((controller) =>
      controller.isReplyOnly(),
    );
    const isNotReply = this.handlerControllers.filter(
      (controller) => !controller.isReplyOnly(),
    );
    this.lastMessageTime = Date.now();
    this.firehoseClient.on("message", (m: SubscribeReposMessage) => {
      if (ComAtprotoSyncSubscribeRepos.isCommit(m)) {
        m.ops.forEach((op: RepoOp) => {
          // console.log(op)
          const payload = op.payload;
          this.lastMessageTime = Date.now();
          // @ts-ignore
          switch (payload?.$type) {
            case "app.bsky.feed.post":
              if (AppBskyFeedPost.isRecord(payload)) {
                const repo = m.repo;
                if (payload.reply) {
                  // for each HandlerController in isReply, call the controller handle function
                  isReply.forEach((controller) => {
                    controller.handle(op, repo);
                  });
                }
                isNotReply.forEach((controller) => {
                  controller.handle(op, repo);
                });
              }
          }
        });
      }
    });
  }

  /**
   * Restarts the subscription for receiving repository operations from the firehose.
   *
   * @return {void}
   */
  public restartSubscription() {
    debugLog("FIREHOSE", `Restarting Subscription`);
    this.firehoseClient.removeAllListeners();
    this.firehoseClient = subscribeRepos(this.wsURL, { decodeRepoOps: true });
    this.createSubscription();
    debugLog("FIREHOSE", `Restarted Subscription`);
  }
}
