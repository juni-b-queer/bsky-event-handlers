import {
  CreateSkeetMessage,
  HandlerAgent,
  IsBadBotValidator,
  Subject,
} from "../../../src";

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe("IsBadBotValidator", () => {
  const validator = new IsBadBotValidator();

  test("shouldTrigger returns true for negative bot responses", async () => {
    const negativeMessage: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
      record: {
        text: "bad bot",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(negativeMessage, mockAgent)).toBe(
      true,
    );
  });

  test("shouldTrigger returns false for non-negative bot responses", async () => {
    const positiveMessage: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
      record: {
        text: "good bot",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };
    expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
      false,
    );
  });
});
