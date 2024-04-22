import {
  CreateSkeetMessage,
  CreateSkeetRecord,
  HandlerAgent,
  ReplyToSkeetAction,
} from "../../../../src";

describe("Reply To Skeet Action", () => {
  let action: ReplyToSkeetAction;
  let handlerAgent: HandlerAgent;
  let message: CreateSkeetMessage;
  const mockCreateSkeet = jest.fn();
  const skeetText: string = "Test Text";

  beforeEach(() => {
    handlerAgent = {
      createSkeet: mockCreateSkeet,
    } as unknown as HandlerAgent;
    message = {
      record: {} as CreateSkeetRecord,
      collection: "",
      did: "",
      opType: "c",
      rkey: "",
      seq: 0,
    };
    action = new ReplyToSkeetAction(skeetText);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should call CreateSkeet with text", async () => {
    await action.handle(message, handlerAgent);
    expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText);
  });
});
