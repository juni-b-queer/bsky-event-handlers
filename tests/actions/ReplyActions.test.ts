import {
  HandlerAgent,
  PostDetails,
  ReplyRepetitivelyFromStringArray,
  ReplyWithGeneratedTextAction,
  ReplyWithInputAction,
} from "../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { BskyAgent } from "@atproto/api";


describe("ReplyWithInputAction tests", () => {
  const replyText = "test reply";
  let createSkeetMock: jest.Mock<any, any, any>
  beforeEach(() => {
    createSkeetMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for handle method in ReplyWithInputAction class
  it("should call the replyToPost function with correct parameters on handle", async () => {
    const handlerAgent: HandlerAgent = {
      createSkeet: createSkeetMock
    } as unknown as HandlerAgent;

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
    await action.handle(handlerAgent, op, postDetails);

    expect(createSkeetMock).toHaveBeenCalledWith(replyText, postDetails);
  });
});

describe("ReplyWithGeneratedTextAction", () => {
  let createSkeetMock: jest.Mock<any, any, any>
  beforeEach(() => {
    createSkeetMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle action and generate a reply", async () => {
    const handlerAgent: HandlerAgent = {
      createSkeet: createSkeetMock
    } as unknown as HandlerAgent;

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

    await action.handle(handlerAgent, op, postDetails);

    expect(createSkeetMock).toHaveBeenCalledWith(
        "test message",
      postDetails,
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

  let postMock: jest.Mock<any, any, any>;
  beforeEach(() => {
    postMock = jest.fn(async () => existingPost)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it("should reply with each string in the given array repetitively", async () => {
    const triggerAction = new ReplyRepetitivelyFromStringArray(["A", "B", "C"]);

    const agent = {
      post: postMock,
    } as unknown as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        "name",
        "handle",
        "password",
        agent
    )

    const op: RepoOp = {
      action: "create",
      path: "testPath",
      cid: "testCid",
    };

    await triggerAction.handle(handlerAgent, op, existingPost);

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
