import {
  ActionTakenByUserValidator,
  CreateSkeetMessage,
  HandlerAgent,
  Subject,
} from "../../../src";

describe("Action Taken By User", () => {
  const validator = new ActionTakenByUserValidator(
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
      cid: "cid",
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
      cid: "cid",
      record: {
        text: "test",
        $type: "",
        createdAt: "",
        subject: {} as Subject,
      },
    };

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(false);
  });

  it("shouldTrigger returns true if not a post, and posted by user", async () => {
    const message: CreateSkeetMessage = {
      collection: "app.bsky.feed.like",
      did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
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

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });
});
