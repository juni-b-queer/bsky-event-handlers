import {
  AgentDetails,
  DebugLogAction,
  LogInputTextAction,
  LogPostDetailsAction,
  LogRepoOperationAction,
  PostDetails,
} from "../../src";
import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import { advanceTo } from "jest-date-mock";
import mocked = jest.mocked;

describe("LogPostDetailsAction", () => {
  let action: LogPostDetailsAction;
  let agentDetails: AgentDetails;
  let op: RepoOp;
  let postDetails: PostDetails;
  console.log = jest.fn();

  beforeEach(() => {
    action = new LogPostDetailsAction();
    agentDetails = {} as AgentDetails;
    op = {
      action: "create",
      path: "test_path",
      cid: null,
    };
    postDetails = {
      uri: "test_uri",
      cid: "test_cid",
      value: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Calls console.log with correct arguments in handle method", async () => {
    await action.handle(agentDetails, op, postDetails);
    expect(console.log).toHaveBeenCalledWith(postDetails);
  });
});

describe("LogRepoOperationAction", () => {
  let action: LogRepoOperationAction;
  let agentDetails: AgentDetails;
  let op: RepoOp;
  let postDetails: PostDetails;
  console.log = jest.fn();

  beforeEach(() => {
    agentDetails = {} as AgentDetails;
    op = {
      action: "create",
      path: "test_path",
      cid: null,
    };
    postDetails = {
      uri: "test_uri",
      cid: "test_cid",
      value: {},
    };
    action = new LogRepoOperationAction();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    await action.handle(agentDetails, op, postDetails);
    expect(console.log).toHaveBeenCalledWith(op);
  });
});

describe("LogInputTextAction", () => {
  let input: string;
  let action: LogInputTextAction;
  let agentDetails: AgentDetails;
  let op: RepoOp;
  let postDetails: PostDetails;
  console.log = jest.fn();

  beforeEach(() => {
    input = "hello";
    agentDetails = {} as AgentDetails;
    op = {
      action: "create",
      path: "test_path",
      cid: null,
    };
    postDetails = {
      uri: "test_uri",
      cid: "test_cid",
      value: {
        payload: {
          text: input,
        },
      },
    };
    action = new LogInputTextAction(input);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    await action.handle(agentDetails, op, postDetails);
    expect(console.log).toHaveBeenCalledWith(input);
  });
});

describe("LogInputTextAction", () => {
  let action: DebugLogAction;
  const agentDetails: AgentDetails = {} as AgentDetails;
  const op: RepoOp = {} as RepoOp;
  const postDetails: PostDetails = {} as PostDetails;
  console.log = jest.fn();

  beforeEach(() => {
    advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
    mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = "true";
    mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = "info";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | INFO | Hello";

    action = new DebugLogAction("TEST", "Hello", "info");

    await action.handle(agentDetails, op, postDetails);
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | ERROR | Hello";

    action = new DebugLogAction("TEST", "Hello", "error");

    await action.handle(agentDetails, op, postDetails);
    expect(console.log).toHaveBeenCalledWith(expected);
  });
});
