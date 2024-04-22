import {
  HandlerAgent,
  JetstreamMessage,
  SimpleFunctionValidator,
} from "../../../src";

describe("FunctionAction", () => {
  const mockHandlerAgent = {} as HandlerAgent;

  const mockMessage: JetstreamMessage = {
    collection: "",
    did: "",
    opType: "c",
    rkey: "",
    seq: 0,
  };

  let mockvalidatorFunction = jest.fn();
  let functionValidator: SimpleFunctionValidator;

  beforeEach(() => {
    jest.clearAllMocks(); // clearing mocks
  });

  describe("Simple Function validator", () => {
    it("runs provided function with proper arguments", async () => {
      mockvalidatorFunction = jest.fn();
      functionValidator = new SimpleFunctionValidator(mockvalidatorFunction);
      await functionValidator.shouldTrigger(mockMessage, mockHandlerAgent);
      expect(mockvalidatorFunction).toHaveBeenCalledWith(
        mockMessage,
        mockHandlerAgent,
      );
    });
  });
});
