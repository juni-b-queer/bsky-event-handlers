import dotenv from 'dotenv'
import {HandlerAgent} from "../../src";
import {generateBskyAgentMock, agentLoginMock, agentPostMock, agentGetPostMock, agentResumeSessionMock} from "../testing-utils/BskyAgentMock";
import atprotoApiMock, {AtpSessionData} from "@atproto/api";

dotenv.config()

// Create a generic mock of '@atproto/api' module
jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    let testHandle: string | undefined = process.env.TEST_HANDLE;
    let testPassword: string | undefined = process.env.TEST_PASSWORD;

    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {

            // Require mocked module and define class' methods
            const atprotoApiMock = require('@atproto/api');
            atprotoApiMock.BskyAgent.prototype.login = agentLoginMock;
            atprotoApiMock.BskyAgent.prototype.post = agentPostMock;
            atprotoApiMock.BskyAgent.prototype.getPost = agentGetPostMock;
            atprotoApiMock.BskyAgent.prototype.resumeSession = agentResumeSessionMock;
            atprotoApiMock.BskyAgent.prototype.session = {did: "did:plc:2bnsooklzchcu5ao7xdjosrs"};

            const mockedAgent = new atprotoApiMock.BskyAgent({service: "www"});
            handlerAgent = new HandlerAgent(
                "agentName",
                testHandle,
                testPassword,
                mockedAgent
            );
        }

    });

    it('constructor() should initialize the agent', () => {
        expect(handlerAgent.getAgent).toBeDefined();
        expect(handlerAgent.getAgentName).toEqual('agentName');
        expect(handlerAgent.getHandle).toEqual(testHandle);
    });


    it('authenticate() should login and resume session if agent exists', async () => {
        // Manually set the session
        handlerAgent.setSession = {
            did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
            // add any other session values needed for your tests
        } as AtpSessionData;
        handlerAgent.setDid = "did:plc:2bnsooklzchcu5ao7xdjosrs";
        await handlerAgent.authenticate();
        expect(agentLoginMock).toHaveBeenCalledTimes(1);
        expect(agentLoginMock).toHaveBeenCalledWith({
            identifier: testHandle,
            password: testPassword,
        });
        expect(handlerAgent.getDid).toBe("did:plc:2bnsooklzchcu5ao7xdjosrs");
    });
});