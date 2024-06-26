import dotenv from 'dotenv';
import { HandlerAgent } from '../../src';
import atprotoApiMock, { AtpSessionData, BskyAgent } from '@atproto/api';

dotenv.config();

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string | undefined =
        process.env.TEST_HANDLE ?? 'testhandle';
    const testPassword: string | undefined =
        process.env.TEST_PASSWORD ?? 'testpassword';
    const loginMock = jest.fn();
    const resumeSessionMock = jest.fn();
    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {
            // Require mocked module and define class' methods
            const mockedAgent = {
                login: loginMock,
                resumeSession: resumeSessionMock,
            } as unknown as BskyAgent;
            handlerAgent = new HandlerAgent(
                'agentName',
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
            did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
            // add any other session values needed for your tests
        } as AtpSessionData;
        handlerAgent.setDid = 'did:plc:2bnsooklzchcu5ao7xdjosrs';
        await handlerAgent.authenticate();
        expect(loginMock).toHaveBeenCalledTimes(1);
        expect(loginMock).toHaveBeenCalledWith({
            identifier: testHandle,
            password: testPassword,
        });
        expect(handlerAgent.getDid).toBe('did:plc:2bnsooklzchcu5ao7xdjosrs');
    });
});
