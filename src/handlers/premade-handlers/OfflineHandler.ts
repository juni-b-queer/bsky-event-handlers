import { PostHandler } from "../PostHandler";
import { InputIsCommandValidator } from "../../validations/StringValidators";
import { ReplyWithInputAction } from "../../actions/ReplyActions";
import { AgentDetails } from "../../types/AgentDetails";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

export class OfflineHandler extends PostHandler {
  constructor(
    private command: string,
    private response: string = "Bot functionality offline",
  ) {
    super(
      [new InputIsCommandValidator(command, false)],
      [new ReplyWithInputAction(response)],
      false,
    );
  }
  handle(agentDetails: AgentDetails, op: RepoOp, repo: string): Promise<void> {
    return super.handle(agentDetails, op, repo);
  }
}
