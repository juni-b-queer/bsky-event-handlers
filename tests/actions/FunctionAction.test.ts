import { RepoOp } from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {FunctionAction, HandlerAgent, PostDetails} from "../../src";
import mocked = jest.mocked; // jest helper function for modifying imported modules

describe("FunctionAction", () => {
  const mockHandlerAgent = {} as HandlerAgent;
  const mockRepoOp: RepoOp = {
    action: "update",
    path: "testPath",
    cid: null,
  };
  const mockPostDetails: PostDetails = {
    uri: "testUri",
    cid: "testCid",
    value: {},
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
      await functionAction.handle(
          mockHandlerAgent,
        mockRepoOp,
        mockPostDetails,
      );

      expect(mockActionFunction).toHaveBeenCalledWith(
          mockHandlerAgent,
        mockRepoOp,
        mockPostDetails,
      );
    });
  });
});
