import {
  AgentDetails,
  InputStartsWithValidator,
  ValidatorInput,
} from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

describe("InputStartsWithValidator", () => {
  const validator = new InputStartsWithValidator("test");
  const strictValidator = new InputStartsWithValidator("test", true);

  test("shouldTrigger returns true if input starts with trigger keyword", async () => {
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

    expect(await validator.shouldTrigger(validatorInput)).toBe(true);
  });

  test("shouldTrigger returns false if input does not start with trigger keyword", async () => {
    const op: RepoOp = {
      payload: {
        text: "message test",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
      agentDetails: {} as AgentDetails,
    };

    expect(await validator.shouldTrigger(validatorInput)).toBe(false);
  });

  test("shouldTrigger in strict mode returns true only if input strictly starts with trigger keyword", async () => {
    const op: RepoOp = {
      payload: {
        text: "Test message",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
      agentDetails: {} as AgentDetails,
    };

    expect(await strictValidator.shouldTrigger(validatorInput)).toBe(false);
  });
});
