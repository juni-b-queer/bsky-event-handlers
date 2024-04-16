import { PostHandler } from "../PostHandler";
import { IsGoodBotValidator } from "../../validations/BotValidators";
import { ReplyingToBotValidator } from "../../validations/PostValidators";
import { ReplyWithInputAction } from "../../actions/ReplyActions";
import { DebugLogAction } from "../../actions/LoggingActions";
import { AgentDetails } from "../../types/AgentDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

export class GoodBotHandler extends PostHandler {
  constructor() {
    super(
      [new IsGoodBotValidator(), new ReplyingToBotValidator()],
      [
        new ReplyWithInputAction("Thank you 🥹"),
        new DebugLogAction("GOOD BOT", `Told I'm good :)`),
      ],
      false,
    );
  }

  async handle(
      //TODO change to agent class
    agentDetails: AgentDetails,
    op: RepoOp,
    repo: string,
  ): Promise<void> {
    return super.handle(agentDetails, op, repo);
  }
}
