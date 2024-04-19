import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AbstractTriggerAction } from "./AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { debugLog } from "../utils/logging-utils";
import { HandlerAgent } from "../agent/HandlerAgent";
import { JetstreamMessage } from "../types/JetstreamTypes";
import { AbstractMessageAction } from "./v2/AbstractMessageAction";
import { DebugLog } from "../utils/DebugLog";

export class LogMessageAction extends AbstractMessageAction {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
  async handle(
    handlerAgent: HandlerAgent,
    message: JetstreamMessage,
  ): Promise<any> {
    console.log(message);
  }
}

export class LogInputTextAction extends AbstractMessageAction {
  constructor(private logText: string) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
  async handle(
    handlerAgent: HandlerAgent,
    message: JetstreamMessage,
  ): Promise<any> {
    console.log(this.logText);
  }
}

export class DebugLogAction extends AbstractMessageAction {
  constructor(
    private action: string,
    private message: string,
    private level: string = "info",
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
  async handle(
    handlerAgent: HandlerAgent,
    message: JetstreamMessage,
  ): Promise<any> {
    DebugLog.log(this.action, this.message, this.level);
  }
}
