import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {AgentDetails, FunctionAction, PostDetails} from "../../src";
import mocked = jest.mocked; // jest helper function for modifying imported modules

describe('FunctionAction', () => {
    const mockBskyAgentDetails =  {} as AgentDetails;
    const mockRepoOp: RepoOp = {
        action: 'update',
        path: 'testPath',
        cid: null
    };
    const mockPostDetails: PostDetails = {
        uri: 'testUri',
        cid: 'testCid',
        value: {}
    };

    let mockActionFunction = jest.fn();
    let functionAction: FunctionAction;

    beforeEach(() => {
        mockActionFunction = jest.fn();
        jest.clearAllMocks(); // clearing mocks
        functionAction = new FunctionAction(mockActionFunction);
    });

    describe('handle', () => {
        it('runs provided function with proper arguments', async () => {
            await functionAction.handle(mockBskyAgentDetails, mockRepoOp, mockPostDetails);

            expect(mockActionFunction).toHaveBeenCalledWith(mockBskyAgentDetails, mockRepoOp, mockPostDetails);
        });
    });
});