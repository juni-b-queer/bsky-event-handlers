import {
  CreateSkeetMessage,
  HandlerAgent,
  InputEqualsValidator,
  InputStartsWithValidator,
  NotValidator,
  OrValidator,
  Subject,
} from "../../../src";

describe("NotValidator", () => {
  const key = "test";
  const equalsKeyValidator = new InputEqualsValidator("test");
  const notValidator = new NotValidator(equalsKeyValidator);
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  test("shouldTrigger returns false if given validator is true", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
      record: {
        text: "test",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await notValidator.shouldTrigger(message, handlerAgent)).toBe(false);
  });

  test("shouldTrigger returns true if given validator is false", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
      record: {
        text: "blah",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await notValidator.shouldTrigger(message, handlerAgent)).toBe(true);
  });
});
