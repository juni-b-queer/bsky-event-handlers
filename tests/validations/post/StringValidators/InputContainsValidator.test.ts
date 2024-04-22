import {
  CreateSkeetMessage,
  HandlerAgent,
  InputContainsValidator,
  Subject,
} from "../../../../src";

describe("InputContainsValidator", () => {
  const validator = new InputContainsValidator("test");
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  test("shouldTrigger returns true if input contains with trigger keyword", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      record: {
        text: "test message",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns true if input contains trigger keyword in other words", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      record: {
        text: "blahblahtestblahblah",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false if input does not contain trigger keyword", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      record: {
        text: "message example",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(false);
  });
});
