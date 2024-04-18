import {PostHandler} from "../PostHandler";
import {IsGoodBotValidator} from "../../validations/BotValidators";
import {ReplyingToBotValidator} from "../../validations/PostValidators";
import {ReplyWithInputAction} from "../../actions/ReplyActions";
import {DebugLogAction} from "../../actions/LoggingActions";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {HandlerAgent} from "../../agent/HandlerAgent";

export class GoodBotHandler extends PostHandler {
  constructor(public handlerAgent: HandlerAgent) {
    super(
      [new IsGoodBotValidator(), new ReplyingToBotValidator()],
      [
        new ReplyWithInputAction("Thank you 🥹"),
        new DebugLogAction("GOOD BOT", `Told I'm good :)`),
      ],
      handlerAgent,
    );
  }

  async handle(
    op: RepoOp,
    repo: string,
  ): Promise<void> {
    return super.handle(op, repo);
  }
}
