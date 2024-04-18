import {
  HandlerAgent,
  InputEqualsValidator,
  ValidatorInput,
} from "../../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

describe("InputEqualsValidator", () => {
  const validator = new InputEqualsValidator("test");
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  /**
   * Test: shouldTrigger returns true if input is trigger keyword
   * This test confirms that the validator correctly returns true when the input
   * matches the trigger keyword.
   */
  test("shouldTrigger returns true if input is trigger keyword", async () => {
    const op: RepoOp = {
      payload: {
        text: "test",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
    };

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(
      true,
    );
  });

  /**
   * Test: shouldTrigger returns false if input does not equal trigger keyword
   * This test confirms that the validator correctly returns false when the input
   * does not match the trigger keyword.
   */
  test("shouldTrigger returns false if input does not equal trigger keyword", async () => {
    const op: RepoOp = {
      payload: {
        text: "message test",
      },
    } as unknown as RepoOp;

    const validatorInput: ValidatorInput = {
      op: op,
      repo: "testRepo",
    };

    expect(await validator.shouldTrigger(validatorInput, handlerAgent)).toBe(
      false,
    );
  });
});
