import { FunctionAction, HandlerAgent, JetstreamMessage } from "../../src";

describe("FunctionAction", () => {
  const mockHandlerAgent = {} as HandlerAgent;

  const mockMessage: JetstreamMessage = {
    collection: "",
    did: "",
    opType: "c",
    rkey: "",
    seq: 0,
    cid: "cid",
  };

  let mockActionFunction = jest.fn();
  let functionAction: FunctionAction;

  beforeEach(() => {
    mockActionFunction = jest.fn();
    jest.clearAllMocks(); // clearing mocks
    functionAction = new FunctionAction(mockActionFunction);
  });

  describe("handle", () => {
    it("runs provided function with proper arguments", async () => {
      await functionAction.handle(mockMessage, mockHandlerAgent);

      expect(mockActionFunction).toHaveBeenCalledWith(
        mockMessage,
        mockHandlerAgent,
      );
    });
  });
});
