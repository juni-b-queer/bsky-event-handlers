import { PostHandler } from "../PostHandler";
import { InputIsCommandValidator } from "../../validations/post/StringValidators";
import { ReplyWithInputAction } from "../../actions/ReplyActions";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { HandlerAgent } from "../../agent/HandlerAgent";

export class OfflineHandler extends PostHandler {
  constructor(
    public handlerAgent: HandlerAgent,
    private command: string,
    private response: string = "Bot functionality offline",
  ) {
    super(
      [new InputIsCommandValidator(command, false)],
      [new ReplyWithInputAction(response)],
      handlerAgent,
    );
  }

  async handle(op: RepoOp, repo: string): Promise<void> {
    return super.handle(op, repo);
  }
}
