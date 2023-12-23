import {
    AbstractTriggerAction,
    AbstractValidator,
    FunctionTriggerAction,
    getPosterDID,
    PostDetails,
    PostHandler, SimpleFunctionValidator
} from "../../src";
import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";


// let mockGetPosterDID =

jest.mock("../../src/utils/agent-post-utils", () => ({
    getPostDetails: jest.fn().mockImplementation((agent: BskyAgent, op: RepoOp, repo: string) => {
        return {
            cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
            uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
            value: {"cid": "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424", "uri": "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n", "payload": {"text": "TestRemindMe! 2 hours", "$type": "app.bsky.feed.post", "langs": ["en"], "reply": {"root": {"cid": "bafyreicxky6wzygxjrlglugqlatt25rkz5h35qqbiarugfuw2lmsgegf5q", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kdmsue53gs2m"}, "parent": {"cid": "bafyreibxmqw44tlmkyy43sdyu3d764los3xonzgk4qngkcceja2pgtp6ka", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kgf47lws352a"}}, "createdAt": "2023-12-13T00:18:22.475Z"}}
        };
    }),
    getPosterDID:  jest.fn()
        .mockReturnValueOnce("did:plc:wpp4lklhvmopw6zcy6qb42ru")
        .mockReturnValueOnce("did:plc:wpp4lklhvmopw6zcy6qb42ru")
        .mockReturnValueOnce("did:plc:wpp4lklhvmopw6zcy6qb42ru")
        .mockReturnValueOnce("did:plc:wpp4lklhvmopw6zcy6qb42ru")
        .mockReturnValueOnce(false)
}));

describe("PostHandler", () => {

    let testTriggerValidators: AbstractValidator[];
    let testTriggerActions: AbstractTriggerAction[];
    let mockActionFunction = jest.fn();
    let mockValidatorFunction = jest.fn();
    let agent: BskyAgent;
    beforeEach(() => {
        jest.clearAllMocks();
        mockActionFunction = jest.fn();
       testTriggerActions = [new FunctionTriggerAction(mockActionFunction)];
        mockValidatorFunction = jest.fn().mockImplementation(() => true);
        testTriggerValidators = [new SimpleFunctionValidator(mockValidatorFunction)];
    });


    it("should handle post by follower correctly", async () => {
        agent = {
            session: {
                did: "blank"
            }
        } as BskyAgent;
        let testPostHandler = new PostHandler(testTriggerValidators, testTriggerActions);
        let testFollowers = ["did:plc:wpp4lklhvmopw6zcy6qb42ru"];

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(mockActionFunction).toHaveBeenCalled();
    });

    it("should handle post by non-follower correctly if following is not required", async () => {
        agent = {
            session: {
                did: "blank"
            }
        } as BskyAgent;
        let testFollowers: string[] = [];
        let testPostHandler = new PostHandler(testTriggerValidators, testTriggerActions, false);

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(mockActionFunction).toHaveBeenCalled();
    });

    it("should handle post by non-follower correctly if following is required", async () => {
        agent = {
            session: {
                did: "blank"
            }
        } as BskyAgent;
        let testFollowers: string[] = [];
        let testPostHandler = new PostHandler(testTriggerValidators, testTriggerActions, true);

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(mockActionFunction).not.toHaveBeenCalled();
    });


    it("should handle post by self correctly by not running action", async () => {
        agent = {
            session: {
                did: "did:plc:wpp4lklhvmopw6zcy6qb42ru"
            }
        } as BskyAgent;
        let testPostHandler = new PostHandler(testTriggerValidators, testTriggerActions);
        let testFollowers = ["did:plc:wpp4lklhvmopw6zcy6qb42ru"];

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(mockActionFunction).not.toHaveBeenCalled();
    });

    it("should handle post if no did found by not running action", async () => {

        agent = {
            session: {
                did: "blank"
            }
        } as BskyAgent;
        let testPostHandler = new PostHandler(testTriggerValidators, testTriggerActions, true);
        let testFollowers: string[] = [];

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(mockActionFunction).not.toHaveBeenCalled();
    });

    it("should handle exception correctly", async () => {
        // console.log = jest.fn();
        const consoleSpy = jest.spyOn(console, 'log');
        agent = {
            session: {
                did: "blank"
            }
        } as BskyAgent;
        let testFollowers: string[] = [];
        let testPostHandler = new PostHandler(testTriggerValidators, [new FunctionTriggerAction(jest.fn().mockImplementation(() => {
            throw new Error('Error');
        }))], false);

        testPostHandler.setAgent(agent);
        testPostHandler.setFollowers(testFollowers);
        await testPostHandler.handle({action: "create", path: "path", cid: "cid" }, "repo");

        expect(consoleSpy).toHaveBeenCalled();
    });

});