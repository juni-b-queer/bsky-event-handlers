import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AbstractPayloadHandler } from "./AbstractPayloadHandler";

export class HandlerController {
  constructor(
    private handlers: Array<AbstractPayloadHandler>,
    private replyOnly: boolean = false,
  ) {}

  public isReplyOnly(): boolean {
    return this.replyOnly;
  }

  handle(op: RepoOp, repo: string) {
    this.handlers.forEach((handler) => {
      handler.handle(op, repo);
    });
  }
}
