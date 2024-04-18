import {
  AgentDetails,
  InputContainsValidator,
  ValidatorInput,
} from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

describe("InputContainsValidator", () => {
  const validator = new InputContainsValidator("test");

  test("shouldTrigger returns true if input contains with trigger keyword", async () => {
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

  test("shouldTrigger returns true if input contains trigger keyword in other words", async () => {
    const op: RepoOp = {
      payload: {
        text: "blahblahtestblahblah",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
      agentDetails: {} as AgentDetails,
    };

    expect(await validator.shouldTrigger(validatorInput)).toBe(true);
  });

  test("shouldTrigger returns false if input does not contain trigger keyword", async () => {
    const op: RepoOp = {
      payload: {
        text: "message example",
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
