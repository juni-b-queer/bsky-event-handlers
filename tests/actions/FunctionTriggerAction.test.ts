import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {FunctionTriggerAction, PostDetails} from "../../src";
import mocked = jest.mocked; // jest helper function for modifying imported modules

describe('FunctionTriggerAction', () => {
    const mockBskyAgent =  {} as BskyAgent;
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
    let functionTriggerAction: FunctionTriggerAction;

    beforeEach(() => {
        mockActionFunction = jest.fn();
        jest.clearAllMocks(); // clearing mocks
        functionTriggerAction = new FunctionTriggerAction(mockActionFunction);
    });

    describe('handle', () => {
        it('runs provided function with proper arguments', async () => {
            await functionTriggerAction.handle(mockBskyAgent, mockRepoOp, mockPostDetails);

            expect(mockActionFunction).toHaveBeenCalledWith(mockBskyAgent, mockRepoOp, mockPostDetails);
        });
    });
});