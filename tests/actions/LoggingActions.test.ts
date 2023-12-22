import {LogInputTextAction, LogPostDetailsAction, LogRepoOperationAction, PostDetails} from "../../src";
import {BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

describe("LogPostDetailsAction", () => {
    let action: LogPostDetailsAction;
    let agent: BskyAgent;
    let op: RepoOp;
    let postDetails: PostDetails;
    console.log = jest.fn();

    beforeEach(() => {
        action = new LogPostDetailsAction();
        agent = {} as BskyAgent;
        op = {
            action: 'create',
            path: 'test_path',
            cid: null,
        };
        postDetails = {
            uri: 'test_uri',
            cid: 'test_cid',
            value: {}
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Calls console.log with correct arguments in handle method", async () => {
        await action.handle(agent, op, postDetails);
        expect(console.log).toHaveBeenCalledWith(postDetails);
    });
});

describe('LogRepoOperationAction', () => {
    let action: LogRepoOperationAction;
    let agent: BskyAgent;
    let op: RepoOp;
    let postDetails: PostDetails;
    console.log = jest.fn();

    beforeEach(() => {
        agent = {} as BskyAgent;
        op = {
            action: 'create',
            path: 'test_path',
            cid: null,
        };
        postDetails = {
            uri: 'test_uri',
            cid: 'test_cid',
            value: {}
        };
        action = new LogRepoOperationAction();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log output of RepoOp object when handle() is called', async () => {
        await action.handle(agent, op, postDetails);
        expect(console.log).toHaveBeenCalledWith(op);
    });
});

describe('LogInputTextAction', () => {
    let input: string;
    let action: LogInputTextAction;
    let agent: BskyAgent;
    let op: RepoOp;
    let postDetails: PostDetails;
    console.log = jest.fn();

    beforeEach(() => {
        input = "hello";
        agent = {} as BskyAgent;
        op = {
            action: 'create',
            path: 'test_path',
            cid: null,
        };
        postDetails = {
            uri: 'test_uri',
            cid: 'test_cid',
            value: {
                payload:{
                    text: input
                }
            }
        };
        action = new LogInputTextAction(input);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log output of RepoOp object when handle() is called', async () => {
        await action.handle(agent, op, postDetails);
        expect(console.log).toHaveBeenCalledWith(input);
    });
});