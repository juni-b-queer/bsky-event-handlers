import {
  CreateSkeetMessage,
  HandlerAgent,
  IsReplyValidator,
  PostedByUserValidator,
  Subject,
} from "../../../src";

describe("Posted by user validator", () => {
  const validator = new PostedByUserValidator(
    "did:plc:2bnsooklzchcu5ao7xdjosrs",
  );
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  test("shouldTrigger returns true if posted by same did", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
      opType: "c",
      rkey: "",
      seq: 0,
      record: {
        text: "test",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false not posted by same user", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "did:plc:bad",
      opType: "c",
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
