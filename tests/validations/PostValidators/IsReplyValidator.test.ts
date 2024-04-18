import {
  HandlerAgent,
  InputContainsValidator,
  IsReplyValidator,
  ValidatorInput,
} from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

describe("IsReplyValidator", () => {
  const validator = new IsReplyValidator();
  const handlerAgent: HandlerAgent = {} as HandlerAgent;


  test("shouldTrigger returns true if op.payload.reply is not null", async () => {
    const op: RepoOp = {
      payload: {
        text: "test message",
        reply: {
          parent: {
            cid: "test",
            uri: "test",
          },
          root: {
            cid: "test",
            uri: "test",
          },
        },
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
    };

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false if op.payload.reply is null", async () => {
    const op: RepoOp = {
      payload: {
        text: "test message",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
    };

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(false);
  });
});
