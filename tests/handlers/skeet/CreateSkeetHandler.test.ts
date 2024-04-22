import {
  CreateSkeetHandler,
  HandlerAgent,
  CreateSkeetMessage,
  AbstractValidator,
  AbstractMessageAction,
  AbstractMessageHandler,
  JetstreamMessage,
  CreateSkeetRecord,
} from "../../../src";
import { anyBoolean } from "jest-mock-extended";
import { DebugLog } from "../../../src/utils/DebugLog";

describe("CreateSkeetHandler", () => {
  let createSkeetHandler: CreateSkeetHandler;
  let mockedHandlerAgent: HandlerAgent;
  let mockedValidators: AbstractValidator[];
  let mockedActions: AbstractMessageAction[];
  let mockValidatorShouldTrigger: jest.Mock<any, any, any>;
  let mockActionHandle: jest.Mock<any, any, any>;
  let mockDebugError: jest.Mock<any, any, any>;

  beforeEach(() => {
    mockDebugError = jest.fn();
    DebugLog.error = mockDebugError;
    mockValidatorShouldTrigger = jest
      .fn()
      .mockImplementation(
        (message: CreateSkeetMessage, agent: HandlerAgent) => {
          return message.opType === "c";
        },
      );
    mockActionHandle = jest
      .fn()
      .mockImplementation(
        (message: CreateSkeetMessage, agent: HandlerAgent) => {
          if (message.seq === 3) {
            throw new Error("error");
          }
          return;
        },
      );
    mockedHandlerAgent = {} as HandlerAgent;
    mockedValidators = [
      {
        shouldTrigger: mockValidatorShouldTrigger,
      } as unknown as AbstractValidator,
    ];
    mockedActions = [
      {
        handle: mockActionHandle,
      } as unknown as AbstractMessageAction,
    ];
    createSkeetHandler = new CreateSkeetHandler(
      mockedValidators,
      mockedActions,
      mockedHandlerAgent,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handle", () => {
    it("should run actions when opType is c", async () => {
      //make CreateSkeetMessage
      const message: CreateSkeetMessage = {
        collection: "",
        did: "",
        opType: "c",
        record: {} as CreateSkeetRecord,
        rkey: "",
        seq: 0,
        cid: "cid"
      };
      await createSkeetHandler.handle(message);

      expect(mockValidatorShouldTrigger).toHaveBeenCalled();
      expect(mockActionHandle).toHaveBeenCalledWith(
        message,
        mockedHandlerAgent,
      );
    });

    it("should run not actions when opType is d", async () => {
      const message: CreateSkeetMessage = {
        collection: "",
        did: "",
        opType: "d",
        record: {} as CreateSkeetRecord,
        rkey: "",
        seq: 0,
        cid: "cid"
      };
      await createSkeetHandler.handle(message);

      expect(mockValidatorShouldTrigger).toHaveBeenCalled();
      expect(mockActionHandle).not.toHaveBeenCalled();
    });

    it("should not run validators when handle throws error", async () => {
      const message: CreateSkeetMessage = {
        collection: "",
        did: "",
        opType: "c",
        record: {} as CreateSkeetRecord,
        rkey: "",
        seq: 3,
        cid: "cid"
      };
      await createSkeetHandler.handle(message);

      expect(mockValidatorShouldTrigger).toHaveBeenCalled();
      expect(mockActionHandle).toHaveBeenCalled();
      expect(mockDebugError).toHaveBeenCalled();
    });
  });
});
