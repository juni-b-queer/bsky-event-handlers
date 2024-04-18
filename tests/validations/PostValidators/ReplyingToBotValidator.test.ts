import {
  HandlerAgent,
  InputContainsValidator,
  IsReplyValidator,
  PostedByUserValidator,
  ReplyingToBotValidator,
  ValidatorInput,
} from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

describe("ReplyingToBotValidator", () => {
  const validator = new ReplyingToBotValidator();

  test("shouldTrigger returns true if the did in the reply.parent.uri is the same as the agent details", async () => {
    const op: RepoOp = {
      payload: {
        text: "test message",
        reply: {
          parent: {
            cid: "bafyrei",
            uri: "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/postid",
          },
          root: {
            cid: "bafyrei",
            uri: "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/postid",
          },
        },
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "did:plc:2bnsooklzchcu33sss5ao7xdjosrs",
    };
    const bskyAgent: BskyAgent = {
      session:{
        did: "did:plc:2bnsooklzchcu5ao7xdjosrs"
      }
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false if the did in the reply.parent.uri is not the same as the agent details", async () => {
    const op: RepoOp = {
      payload: {
        text: "test message",
        reply: {
          parent: {
            cid: "bafyrei",
            uri: "at://did:plc:different/app.bsky.feed.post/postid",
          },
          root: {
            cid: "bafyrei",
            uri: "at://did:plc:different/app.bsky.feed.post/postid",
          },
        },
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "bad"
    };

    const bskyAgent: BskyAgent = {
      session:{
        did: ""
      }
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(false);
  });
});
