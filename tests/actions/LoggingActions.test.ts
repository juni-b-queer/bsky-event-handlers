import {
  DebugLogAction,
  HandlerAgent,
  JetstreamMessage,
  LogInputTextAction,
  LogMessageAction,
} from "../../src";
import { advanceTo } from "jest-date-mock";
import mocked = jest.mocked;

describe("LogMessageAction", () => {
  let action: LogMessageAction;
  let handlerAgent: HandlerAgent;
  let message: JetstreamMessage;
  console.log = jest.fn();

  beforeEach(() => {
    handlerAgent = {} as HandlerAgent;
    message = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
    };
    action = new LogMessageAction();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(message);
  });
});

describe("LogInputTextAction", () => {
  let input: string;
  let action: LogInputTextAction;
  let handlerAgent: HandlerAgent;
  let message: JetstreamMessage;
  console.log = jest.fn();

  beforeEach(() => {
    input = "hello";
    handlerAgent = {} as HandlerAgent;
    message = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
    };
    action = new LogInputTextAction(input);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log output of RepoOp object when handle() is called", async () => {
    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(input);
  });
});

describe("LogInputTextAction", () => {
  let action: DebugLogAction;
  const handlerAgent: HandlerAgent = {} as HandlerAgent;
  const message: JetstreamMessage = {} as JetstreamMessage;
  console.log = jest.fn();

  beforeEach(() => {
    advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
    mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = "true";
    mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = "info";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should log info when no level given", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | INFO | Hello";

    action = new DebugLogAction("TEST", "Hello");

    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it("Should log info", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | INFO | Hello";

    action = new DebugLogAction("TEST", "Hello", "info");

    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it("Should log warn", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | WARN | Hello";

    action = new DebugLogAction("TEST", "Hello", "warn");

    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it("Should log error", async () => {
    const expected = "1/31/2023, 07:00 PM | TEST | ERROR | Hello";

    action = new DebugLogAction("TEST", "Hello", "error");

    await action.handle(message, handlerAgent);
    expect(console.log).toHaveBeenCalledWith(expected);
  });
});
