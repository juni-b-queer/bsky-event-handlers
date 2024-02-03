import {
  AgentDetails,
  PostDetails,
  ReplyRepetitivelyFromStringArray,
  ReplyWithGeneratedTextAction,
  ReplyWithInputAction,
} from "../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";

jest.mock("../../src/utils/agent-post-utils", () => ({
  replyToPost: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const replyToPostMock = require("../../src/utils/agent-post-utils").replyToPost;

describe("ReplyWithInputAction tests", () => {
  const replyText = "test reply";

  beforeEach(() => {
    replyToPostMock.mockClear();
  });

  // Test case for handle method in ReplyWithInputAction class
  it("should call the replyToPost function with correct parameters on handle", async () => {
    const agent = {} as BskyAgent;
    const agentDetails: AgentDetails = {
      agent: agent,
    } as AgentDetails;

    const op: RepoOp = {
      action: "create",
      path: "test path",
      cid: null,
    };
    const postDetails: PostDetails = {
      uri: "test uri",
      cid: "test cid",
      value: {},
    };

    const action = new ReplyWithInputAction(replyText);
    await action.handle(agentDetails, op, postDetails);

    expect(replyToPostMock).toHaveBeenCalledWith(agent, postDetails, replyText);
  });
});

describe("ReplyWithGeneratedTextAction", () => {
  it("should handle action and generate a reply", async () => {
    const agent = {} as BskyAgent;
    const agentDetails: AgentDetails = {
      agent: agent,
    } as AgentDetails;
    const op: RepoOp = {
      action: "create",
      path: "test path",
      cid: null,
    };
    const postDetails: PostDetails = {
      uri: "test uri",
      cid: "test cid",
      value: {
        payload: {
          text: "hello",
        },
      },
    };

    const replyGeneratorFunction = () => "test message";
    const action = new ReplyWithGeneratedTextAction(replyGeneratorFunction);

    await action.handle(agentDetails, op, postDetails);

    expect(replyToPostMock).toHaveBeenCalledWith(
      agent,
      postDetails,
      "test message",
    );
  });
});

describe("ReplyRepetitivelyFromStringArray", () => {
  const existingPost: PostDetails = {
    uri: "testUri",
    cid: "testCid",
    value: {
      reply: {
        root: {
          cid: "testCid",
          uri: "testUri",
        },
        parent: {
          cid: "testCid",
          uri: "testUri",
        },
      },
    },
  };

  const agent = {
    post: jest.fn(async () => existingPost),
  } as unknown as BskyAgent;

  it("should reply with each string in the given array repetitively", async () => {
    const triggerAction = new ReplyRepetitivelyFromStringArray(["A", "B", "C"]);

    const op: RepoOp = {
      action: "create",
      path: "testPath",
      cid: "testCid",
    };
    const agentDetails: AgentDetails = {
      agent: agent,
    } as AgentDetails;

    await triggerAction.handle(agentDetails, op, existingPost);

    expect(agent.post).toHaveBeenCalledTimes(3);
    expect(agent.post).toHaveBeenCalledWith({
      reply: {
        root: {
          cid: "testCid",
          uri: "testUri",
        },
        parent: {
          cid: "testCid",
          uri: "testUri",
        },
      },
      text: "A",
    });
    expect(agent.post).toHaveBeenCalledWith({
      reply: {
        root: {
          cid: "testCid",
          uri: "testUri",
        },
        parent: {
          cid: "testCid",
          uri: "testUri",
        },
      },
      text: "B",
    });
    expect(agent.post).toHaveBeenCalledWith({
      reply: {
        root: {
          cid: "testCid",
          uri: "testUri",
        },
        parent: {
          cid: "testCid",
          uri: "testUri",
        },
      },
      text: "C",
    });
  });
});
