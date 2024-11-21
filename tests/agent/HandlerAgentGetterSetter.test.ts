import { HandlerAgent } from '../../src';
import { AtpSessionData, BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
process.env.SESSION_DATA_PATH = './tests/temp/getterSetter';

jest.mock('@atproto/api', () => jest.genMockFromModule('@atproto/api'));

describe('HandlerAgent', () => {
    afterAll(() => {
        fs.rmSync('./tests/temp/getterSetter', {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync('./tests/temp/getterSetter');

    let handlerAgent: HandlerAgent;
    const testHandle: string = 'testhandle';
    const testPassword: string = 'testpassword';
    let mockedAgent: BskyAgent;
    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {
            mockedAgent = {
                session: {
                    did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
                } as AtpSessionData,
            } as BskyAgent;
            handlerAgent = new HandlerAgent(
                'agentName',
                testHandle,
                testPassword,
                mockedAgent
            );
        }

        if (fs.existsSync('./agentName-session.json')) {
            fs.unlinkSync('./agentName-session.json');
        }
    });

    it('#getAgent & setAgent should get correct agent value', () => {
        expect(handlerAgent.getAgent).toBe(mockedAgent);
        const mockAgent = new BskyAgent({ service: 'www' });
        handlerAgent.setAgent = mockAgent;
        expect(handlerAgent.getAgent).toBe(mockAgent);
    });

    it('#getPassword & setPassword should get correct agent value', () => {
        expect(handlerAgent.getPassword).toBe(testPassword);
        const otherPassword = 'other';
        handlerAgent.setPassword = otherPassword;
        expect(handlerAgent.getPassword).toBe(otherPassword);
    });

    it('#getAgentName & setAgentName should set correct agentName value', () => {
        const testAgentName = 'TestAgent';
        handlerAgent.setAgentName = testAgentName;
        expect(handlerAgent.getAgentName).toBe(testAgentName);
        if (fs.existsSync('./Test Agent-session.json')) {
            fs.unlinkSync('./Test Agent-session.json');
        }
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

        handlerAgent.setDid = undefined;
        expect(handlerAgent.getDid).toBe('');
    });

    it('#getSession & setSession should set correct session value', () => {
        handlerAgent.setAgentName = 'agentName';
        const saveSessionMock = jest.fn();
        handlerAgent.saveSessionData = saveSessionMock;
        const testSession = {
            did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
        } as AtpSessionData;
        handlerAgent.setSession = testSession;

        expect(saveSessionMock).toBeCalledWith(testSession);

        expect(handlerAgent.getSession).toBe(testSession);

        handlerAgent.setSession = undefined;
        expect(handlerAgent.getSession).toBe(false);
        expect(saveSessionMock).toBeCalledTimes(1);
    });
});
