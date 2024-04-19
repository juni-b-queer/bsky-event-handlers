import {
  CreateSkeetMessage,
  HandlerAgent,
  ReplyingToBotValidator,
  Subject,
} from "../../../src";
import { BskyAgent } from "@atproto/api";

describe("ReplyingToBotValidator", () => {
  const validator = new ReplyingToBotValidator();

  test("shouldTrigger returns true if the did is the same as the agent", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
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

    const bskyAgent: BskyAgent = {
      session: {
        did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
      },
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
      "name",
      "handle",
      "password",
      bskyAgent,
    );

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
  });

  test("shouldTrigger returns false if the did in the reply.parent.uri is not the same as the agent details", async () => {
    const message: CreateSkeetMessage = {
      collection: "",
      did: "did:plc:bad",
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
    const bskyAgent: BskyAgent = {
      session: {
        did: "did:plc:hello",
      },
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
      "name",
      "handle",
      "password",
      bskyAgent,
    );

    expect(await validator.shouldTrigger(message, handlerAgent)).toBe(false);
  });
});
