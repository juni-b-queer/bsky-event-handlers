import { PostHandler } from "../PostHandler";
import { IsBadBotValidator } from "../../validations/BotValidators";
import { ReplyingToBotValidator } from "../../validations/PostValidators";
import { ReplyWithInputAction } from "../../actions/ReplyActions";
import { DebugLogAction } from "../../actions/LoggingActions";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { HandlerAgent } from "../../agent/HandlerAgent";

export class BadBotHandler extends PostHandler {
  constructor(public handlerAgent: HandlerAgent) {
    super(
      [new IsBadBotValidator(), new ReplyingToBotValidator()],
      [
        new ReplyWithInputAction("I'm sorry 😓"),
        new DebugLogAction("BAD BOT", `Told I'm bad :(`),
      ],
      handlerAgent,
    );
  }

  async handle(op: RepoOp, repo: string): Promise<void> {
    return super.handle(op, repo);
  }
}
