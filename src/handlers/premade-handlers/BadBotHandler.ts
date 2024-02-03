import { PostHandler } from "../PostHandler";
import { IsBadBotValidator } from "../../validations/BotValidators";
import { ReplyingToBotValidator } from "../../validations/PostValidators";
import { ReplyWithInputAction } from "../../actions/ReplyActions";
import { DebugLogAction } from "../../actions/LoggingActions";
import { AgentDetails } from "../../types/AgentDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

export class BadBotHandler extends PostHandler {
  constructor() {
    super(
      [new IsBadBotValidator(), new ReplyingToBotValidator()],
      [
        new ReplyWithInputAction("I'm sorry 😓"),
        new DebugLogAction("BAD BOT", `Told I'm bad :(`),
      ],
      false,
    );
  }

  async handle(
    agentDetails: AgentDetails,
    op: RepoOp,
    repo: string,
  ): Promise<void> {
    return super.handle(agentDetails, op, repo);
  }
}
