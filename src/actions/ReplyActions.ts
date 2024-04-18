import { BskyAgent, RichText } from "@atproto/api";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { AbstractTriggerAction } from "./AbstractTriggerAction";
import { PostDetails } from "../types/PostDetails";
import { sleep } from "../utils/private-utils";
import { HandlerAgent } from "../agent/HandlerAgent";

export class ReplyWithInputAction extends AbstractTriggerAction {
  constructor(private replyText: string) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    return await handlerAgent.createSkeet(this.replyText, postDetails);
  }
}

export class ReplyWithGeneratedTextAction extends AbstractTriggerAction {
  constructor(
    private replyGeneratorFunction: (
      handlerAgent: HandlerAgent,
      op: RepoOp,
      postDetails: PostDetails,
    ) => string,
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ): Promise<any> {
    const responseText: string = this.replyGeneratorFunction(
      handlerAgent,
      op,
      postDetails,
    );

    return await handlerAgent.createSkeet(responseText, postDetails);
  }
}

export class ReplyRepetitivelyFromStringArray extends AbstractTriggerAction {
  constructor(private inputArray: string[]) {
    super();
  }

  async handle(
    handlerAgent: HandlerAgent,
    op: RepoOp,
    postDetails: PostDetails,
  ) {
    let lastPost = postDetails;
    for (const skeetText of this.inputArray) {
      lastPost = await this.replyWithNextPost(
        handlerAgent,
        lastPost,
        skeetText,
      );
      await sleep(50);
    }
  }

  async replyWithNextPost(
    handlerAgent: HandlerAgent,
    currentPost: PostDetails,
    replyTextInput: string,
  ): Promise<PostDetails> {
    const replyText = new RichText({
      text: replyTextInput,
    });

    const reply = {
      root: {
        cid: currentPost.cid,
        uri: currentPost.uri,
      },
      parent: {
        cid: currentPost.cid,
        uri: currentPost.uri,
      },
    };

    if (handlerAgent.hasPostReplyRoot(currentPost)) {
      reply.root = handlerAgent.getPostReplyRoot(currentPost);
    }

    const newPost = await handlerAgent.post({
      reply: reply,
      text: replyText.text,
    });

    return {
      cid: newPost.cid,
      uri: newPost.uri,
      value: {
        reply: reply,
      },
    };
  }
}
