import { AgentDetails, IsReplyValidator, ValidatorInput } from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

describe("IsReplyValidator", () => {
  const validator = new IsReplyValidator();

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
      agentDetails: {} as AgentDetails,
    };

    expect(await validator.shouldTrigger(validatorInput)).toBe(true);
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
      agentDetails: {} as AgentDetails,
    };

    expect(await validator.shouldTrigger(validatorInput)).toBe(false);
  });
});
