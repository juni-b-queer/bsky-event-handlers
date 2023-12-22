import {
    AgentDetails,
    authenticateAgent,
    createAgent,
    getPostDetails,
    getPosterDID,
    PostDetails,
    replyToPost
} from "../../src";
import {AtpSessionData, AtpSessionEvent, BskyAgent} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";

describe('replyToPost Function', () => {
    let agent: BskyAgent;
    let mockPost: jest.Mock;
    let currentPost: PostDetails;

    beforeEach(() => {
        currentPost = {
            uri: 'a sample uri',
            cid: 'a sample cid',
            value: {
                payload:{
                    text: "hello"
                }
            }, // to be changed depending on what required in each test
        };

        agent = {} as BskyAgent;

        mockPost = jest.fn();
        agent.post = mockPost;
    });

    it('should reply to the given post', async () => {
        await replyToPost(agent, currentPost, 'sample text');

        expect(agent.post).toHaveBeenCalledWith({
            reply: {
                root: {
                    cid: currentPost.cid,
                    uri: currentPost.uri
                },
                parent: {
                    cid: currentPost.cid,
                    uri: currentPost.uri
                }
            },
            text: 'sample text'
        });
    });

    it('should reply to a post with value contains reply', async () => {
        // @ts-ignore
        currentPost.value.reply = {
            root: {
                cid: 'root cid',
                uri: 'root uri'
            },
            parent: {
                cid: currentPost.cid,
                uri: currentPost.uri
            }
        };

        await replyToPost(agent, currentPost, 'sample text');

        expect(agent.post).toHaveBeenCalledWith({
            reply: {
                root: {
                    cid: 'root cid',
                    uri: 'root uri'
                },
                parent: {
                    cid: currentPost.cid,
                    uri: currentPost.uri
                }
            },
            text: 'sample text'
        });
    });
});

describe('function getPostDetails', () => {

    let agent: BskyAgent;
    let repoOp: RepoOp;
    let repo: string;
    let expectedResult: PostDetails;
    let mockGetPost: jest.Mock;

    beforeEach(() => {
        agent = {} as BskyAgent;
        expectedResult = {
            cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
            uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
            value: {"cid": "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424", "uri": "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n", "value": {"text": "TestRemindMe! 2 hours", "$type": "app.bsky.feed.post", "langs": ["en"], "reply": {"root": {"cid": "bafyreicxky6wzygxjrlglugqlatt25rkz5h35qqbiarugfuw2lmsgegf5q", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kdmsue53gs2m"}, "parent": {"cid": "bafyreibxmqw44tlmkyy43sdyu3d764los3xonzgk4qngkcceja2pgtp6ka", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kgf47lws352a"}}, "createdAt": "2023-12-13T00:18:22.475Z"}}
        }


        repoOp = {
            action: 'create',
            path: 'test/path',
            cid: null,
        };
        repo = 'testRepo';
    });

    it('returns the correct post', async () => {
        // Mock value for test
        mockGetPost = jest.fn().mockResolvedValue(expectedResult);
        agent.getPost = mockGetPost;


        const result = await getPostDetails(agent, repoOp, repo);

        expect(result).toEqual(expectedResult);
        expect(agent.getPost).toHaveBeenCalledWith({
            repo: repo,
            rkey: repoOp.path.split('/')[1],
        });
    });

    it('throws an error if getPost rejects', async () => {
        // Mock throwing error
        const expectedError = new Error('Test error');
        mockGetPost = jest.fn().mockRejectedValue(expectedError);
        agent.getPost = mockGetPost;

        await expect(getPostDetails(agent, repoOp, repo)).rejects.toThrow(expectedError);
    });
});



describe('createAgent tests', () => {
    let mockAgentDetails: AgentDetails = {
        name: 'Test',
        handle: 'testHandle',
        password: 'testPassword',
        did: 'testDid',
        sessionData: {} as AtpSessionData,
        agent: undefined
    };
    jest.mock('@atproto/api', () => ({
        BskyAgent: jest.fn().mockImplementation(() => ({
            service: 'https://bsky.social/',
            persistSession: jest.fn().mockImplementation((evt: AtpSessionEvent, sess?: AtpSessionData) =>{
                mockAgentDetails.did = sess?.did
                mockAgentDetails.sessionData = sess;
            }),
        }))
    }));


    it('should create a new agent', () => {
        const result = createAgent(mockAgentDetails);
        expect(result.agent).toBeDefined();
        expect(result.did).toEqual(mockAgentDetails.did);
        expect(result.sessionData).toEqual(mockAgentDetails.sessionData);
    });
});



describe('authenticateAgent Function', () => {
    let agentDetails : AgentDetails = {
        name: "",
        handle: "",
        password: "",
        did: "undefined",
        sessionData: {} as AtpSessionData,
        agent: {} as unknown as BskyAgent
    };
    beforeEach(() => {
        agentDetails.agent = {
            login: jest.fn(),
            resumeSession: jest.fn()
        } as unknown as BskyAgent
    });

    it('should authenticate agent given valid agent details', async () => {
        agentDetails.name = "testAgent";
        agentDetails.handle = "testHandle";
        agentDetails.password = "testPassword";
        agentDetails.sessionData = {} as AtpSessionData;
        await authenticateAgent(agentDetails);
        expect(agentDetails.agent?.login).toHaveBeenCalledTimes(1);
        expect(agentDetails.agent?.resumeSession).toHaveBeenCalledTimes(1);
    });

    it('should throw error when session data is undefined', async () => {
        agentDetails.name = "testAgent";
        agentDetails.handle = "testHandle";
        agentDetails.password = "testPassword";
        agentDetails.sessionData = undefined;
        await expect(authenticateAgent(agentDetails)).rejects.toThrow('Could not retrieve bluesky session data for reply bot');
    });
});
describe("Get Post DID", () => {
    test("Get DID from post details", () => {
        let postDetails: PostDetails = {
            cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
            uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
            value: {"cid": "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424", "uri": "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n", "value": {"text": "TestRemindMe! 2 hours", "$type": "app.bsky.feed.post", "langs": ["en"], "reply": {"root": {"cid": "bafyreicxky6wzygxjrlglugqlatt25rkz5h35qqbiarugfuw2lmsgegf5q", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kdmsue53gs2m"}, "parent": {"cid": "bafyreibxmqw44tlmkyy43sdyu3d764los3xonzgk4qngkcceja2pgtp6ka", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kgf47lws352a"}}, "createdAt": "2023-12-13T00:18:22.475Z"}}
        }
        let expected = "did:plc:wpp4lklhvmopw6zcy6qb42ru";
        expect(getPosterDID(postDetails)).toBe(expected);
    });

});
