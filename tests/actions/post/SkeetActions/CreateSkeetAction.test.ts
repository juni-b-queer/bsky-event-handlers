import {
  CreateSkeetAction,
  CreateSkeetWithGeneratedTextAction,
  HandlerAgent,
  JetstreamMessage,
} from "../../../../src";

describe("Create Skeet Action", () => {
  let action: CreateSkeetAction;
  let handlerAgent: HandlerAgent;
  let message: JetstreamMessage;
  const mockCreateSkeet = jest.fn();
  const skeetText: string = "Test Text";

  beforeEach(() => {
    handlerAgent = {
      createSkeet: mockCreateSkeet,
    } as unknown as HandlerAgent;
    message = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
    };
    action = new CreateSkeetAction(skeetText);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should call CreateSkeet with text", async () => {
    await action.handle(message, handlerAgent);
    expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText);
  });
});

describe("Create Skeet from generated text Action", () => {
  let action: CreateSkeetWithGeneratedTextAction;
  let handlerAgent: HandlerAgent;
  let message: JetstreamMessage;
  const mockGenerateText = jest.fn().mockReturnValue("hello");
  const mockCreateSkeet = jest.fn();
  const skeetText: string = "Test Text";

  beforeEach(() => {
    handlerAgent = {
      createSkeet: mockCreateSkeet,
    } as unknown as HandlerAgent;
    message = {
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
      cid: "cid",
    };
    action = new CreateSkeetWithGeneratedTextAction(mockGenerateText);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should call CreateSkeet with text", async () => {
    await action.handle(message, handlerAgent);
    expect(mockGenerateText).toHaveBeenCalledWith(message, handlerAgent);
    expect(mockCreateSkeet).toHaveBeenCalledWith("hello");
  });
});