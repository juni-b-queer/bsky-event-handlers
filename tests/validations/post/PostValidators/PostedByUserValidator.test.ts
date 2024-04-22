import {
  CreateSkeetMessage,
  HandlerAgent,
  IsReplyValidator,
  PostedByUserValidator,
  Subject,
} from "../../../../src";

describe("Posted by user validator", () => {
  const validator = new PostedByUserValidator(
    "did:plc:2bnsooklzchcu5ao7xdjosrs",
  );
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  it("shouldTrigger returns true if posted by same did", async () => {
    const message: CreateSkeetMessage = {
      collection: "app.bsky.feed.post",
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

  it("shouldTrigger returns false not posted by same user", async () => {
    const message: CreateSkeetMessage = {
      collection: "app.bsky.feed.post",
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

  it("shouldTrigger returns false if not a post", async () => {
    const message: CreateSkeetMessage = {
      collection: "app.bsky.feed.like",
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

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(false);
  });
});
