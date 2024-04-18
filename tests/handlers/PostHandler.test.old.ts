import {
  FunctionAction,
  PostHandler,
  SimpleFunctionValidator,
} from "../../src";
import { BskyAgent } from "@atproto/api";

// TODO Rewrite these entire tests

jest.mock("../../src/utils/agent-post-utils", () => ({
  getPostDetails: jest.fn().mockImplementation(generatePostDetails),
  getPosterDID: jest.fn().mockReturnValue("did:plc:wpp4lklhvmopw6zcy6qb42ru"),
}));

const consoleSpy = jest.spyOn(console, "log"); // Spy on console log function

describe("PostHandler", () => {
  const commonTestSetup = {
    testTriggerValidators: [],
    testTriggerActions: [],
    testTriggerErrorActions: [],
    mockActionFunction: jest.fn(),
    mockActionErrorFunction: jest.fn().mockImplementation(() => {
      throw new Error("hello");
    }),
    mockValidatorFunction: jest.fn(),
    testAgentDetails: {},
  };

  beforeEach(() => {
    commonTestSetup.mockActionFunction = jest.fn();
    // @ts-ignore
    commonTestSetup.testTriggerActions = [
      // @ts-ignore
      new FunctionAction(commonTestSetup.mockActionFunction),
    ];
    commonTestSetup.mockValidatorFunction = jest
      .fn()
      .mockImplementation(() => true);
    commonTestSetup.mockActionErrorFunction = jest
      .fn()
      .mockImplementation(() => {
        throw new Error("hello");
      });
    // @ts-ignore
    commonTestSetup.testTriggerErrorActions = [
      // @ts-ignore
      new FunctionAction(commonTestSetup.mockActionErrorFunction),
    ];
    // @ts-ignore
    commonTestSetup.testTriggerValidators = [
      // @ts-ignore
      new SimpleFunctionValidator(commonTestSetup.mockValidatorFunction),
    ];
    commonTestSetup.testAgentDetails = {
      name: "test-bot",
      did: undefined,
      handle: "handle",
      password: "password",
      sessionData: undefined,
      agent: undefined,
    };
    consoleSpy.mockClear();
  });

  it("should handle exception correctly", async () => {
    await handleExceptionCase(commonTestSetup);
  });

  it("should handle post by follower correctly", async () => {
    await handlePostByFollower(commonTestSetup);
  });

  it("should handle post by non-follower correctly if following is not required", async () => {
    await handlePostByNonFollower(commonTestSetup, false);
  });

  it("should handle post by non-follower correctly if following is required", async () => {
    await handlePostByNonFollower(commonTestSetup, true);
  });

  it("should handle post by self correctly by not running action", async () => {
    await handlePostBySelfNotRunningAction(commonTestSetup);
  });
});

// Refactored mock function and test handlers
function generatePostDetails() {
  return {
    cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
    uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
    value: {
      cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
      uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
      payload: {
        text: "TestRemindMe! 2 hours",
        $type: "app.bsky.feed.post",
        langs: ["en"],
        reply: {
          root: {
            cid: "bafyreicxky6wzygxjrlglugqlatt25rkz5h35qqbiarugfuw2lmsgegf5q",
            uri: "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kdmsue53gs2m",
          },
          parent: {
            cid: "bafyreibxmqw44tlmkyy43sdyu3d764los3xonzgk4qngkcceja2pgtp6ka",
            uri: "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kgf47lws352a",
          },
        },
        createdAt: "2023-12-13T00:18:22.475Z",
      },
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleTestSetup(
  testSetup: any,
  settingAgentDetails = true,
  followers = [],
  requireFollowing = false,
  throwException: boolean = false,
  postedBySelf: boolean = false,
) {
  if (settingAgentDetails) {
    testSetup.testAgentDetails.agent = {
      session: {
        did: "blank",
      },
    } as BskyAgent;
  }
  if (postedBySelf) {
    testSetup.testAgentDetails.did = "did:plc:wpp4lklhvmopw6zcy6qb42ru";
  }
  let testPostHandler: PostHandler;

  if (throwException) {
    testPostHandler = new PostHandler(
      testSetup.testTriggerValidators,
      testSetup.testTriggerErrorActions,
      requireFollowing,
    );
  } else {
    if (requireFollowing) {
      testPostHandler = new PostHandler(
        testSetup.testTriggerValidators,
        testSetup.testTriggerActions,
      );
    } else {
      testPostHandler = new PostHandler(
        testSetup.testTriggerValidators,
        testSetup.testTriggerActions,
        requireFollowing,
      );
    }
  }

  testPostHandler.setAgentDetails(testSetup.testAgentDetails);
  testPostHandler.setFollowers(followers);
  return testPostHandler.handle(
    testSetup.testAgentDetails,
    { action: "create", path: "path", cid: "cid" },
    "did:plc:wpp4lklhvmopw6zcy6qb42ru",
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleExceptionCase(testSetup: any) {
  await handleTestSetup(testSetup, true, [], false, true);
  expect(consoleSpy).toHaveBeenCalled();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePostByFollower(testSetup: any) {
  // @ts-ignore
  await handleTestSetup(
    testSetup,
    true,
    // @ts-ignore
    ["did:plc:wpp4lklhvmopw6zcy6qb42ru"],
    true,
  );
  expect(testSetup.mockActionFunction).toHaveBeenCalled();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePostByNonFollower(
  testSetup: any,
  requireFollowing: boolean,
) {
  await handleTestSetup(testSetup, true, [], requireFollowing);
  if (requireFollowing) {
    expect(testSetup.mockActionFunction).not.toHaveBeenCalled();
  } else {
    expect(testSetup.mockActionFunction).toHaveBeenCalled();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePostBySelfNotRunningAction(testSetup: any) {
  await handleTestSetup(testSetup, true, [], false, false, true);
  expect(testSetup.mockActionFunction).not.toHaveBeenCalled();
}
