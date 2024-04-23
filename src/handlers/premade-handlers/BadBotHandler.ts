import { IsBadBotValidator } from "../../validations/BotValidators";
import { DebugLogAction } from "../../actions/LoggingActions";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { HandlerAgent } from "../../agent/HandlerAgent";
import {CreateSkeetHandler} from "../record-handlers/skeet/CreateSkeetHandler";
import {ReplyToSkeetAction} from "../../actions/post/SkeetActions";
import {CreateSkeetMessage} from "../../types/JetstreamTypes";

export class BadBotHandler extends CreateSkeetHandler {
  constructor(public handlerAgent: HandlerAgent) {
    super(
      [new IsBadBotValidator()],
      [
        new ReplyToSkeetAction("I'm sorry 😓"),
        new DebugLogAction("BAD BOT", `Told I'm bad :(`),
      ],
      handlerAgent,
    );
  }

  async handle(message: CreateSkeetMessage): Promise<void> {
    return super.handle(message);
  }
}
