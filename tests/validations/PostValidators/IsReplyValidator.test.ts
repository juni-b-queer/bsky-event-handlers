import {
  CreateSkeetMessage,
  HandlerAgent,
  IsReplyValidator,
  Subject,
} from "../../../src";

describe("IsReplyValidator", () => {
  const validator = new IsReplyValidator();
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  test("shouldTrigger returns true if op.payload.reply is not null", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "",
      rkey: "",
      seq: 0,
      record: {
        text: "test",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
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
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false if op.payload.reply is null", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "",
      opType: "",
      rkey: "",
      seq: 0,
      record: {
        text: "test",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(false);
  });
});
