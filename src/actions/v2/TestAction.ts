import { HandlerAgent } from "../../agent/HandlerAgent";
import { JetstreamMessage } from "../../types/JetstreamTypes";
import { DebugLog } from "../../utils/DebugLog";

export class TestAction {
  async handle(
    handlerAgent: HandlerAgent,
    message: JetstreamMessage,
  ): Promise<any | void> {
    DebugLog.info("Working", "working");
  }
}
