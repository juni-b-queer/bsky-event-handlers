import {HandlerAgent} from "../../src";
import {AtpSessionData, BskyAgent} from "@atproto/api";
import dotenv from 'dotenv'

dotenv.config()

jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    let testHandle: string | undefined = process.env.TEST_HANDLE;
    let testPassword: string | undefined = process.env.TEST_PASSWORD;
    let mockedAgent: BskyAgent;
    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {

            mockedAgent = {
                session: {
                    did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
                } as AtpSessionData
            } as BskyAgent;
            handlerAgent = new HandlerAgent(
                "agentName",
                testHandle,
                testPassword,
                mockedAgent
            );
        }
    });

    it('#getAgent & setAgent should get correct agent value', () => {
        expect(handlerAgent.getAgent).toBe(mockedAgent);
        const mockAgent = new BskyAgent({service: "www"});
        handlerAgent.setAgent = mockAgent;
        expect(handlerAgent.getAgent).toBe(mockAgent);
    });

    it('#getAgentName & setAgentName should set correct agentName value', () => {
        const testAgentName = 'TestAgent';
        handlerAgent.setAgentName = testAgentName;
        expect(handlerAgent.getAgentName).toBe(testAgentName);
    });

    it('#getHandle & setHandle should set correct handle value', () => {
        const testHandle = 'TestHandle';
        handlerAgent.setHandle = testHandle;
        expect(handlerAgent.getHandle).toBe(testHandle);
    });

    it('#getDid & setDid should set correct did value', () => {
        const testDid = 'TestDid';
        handlerAgent.setDid = testDid;
        expect(handlerAgent.getDid).toBe(testDid);
    });

    it('#getSession & setSession should set correct session value', () => {
        const testSession = {
            did: "did:plc:2bnsooklzchcu5ao7xdjosrs",
        } as AtpSessionData;
        handlerAgent.setSession = testSession;
        expect(handlerAgent.getSession).toBe(testSession);
    });
});