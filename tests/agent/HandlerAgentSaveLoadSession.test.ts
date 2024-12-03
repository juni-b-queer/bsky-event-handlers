import dotenv from 'dotenv';
import fs from 'fs';
import { DebugLog, HandlerAgent } from '../../src';
import { AtpSessionData } from '@atproto/api';

dotenv.config();
process.env.SESSION_DATA_PATH = './tests/temp/saveLoad';

describe('HandlerAgent Session Management', () => {
    fs.mkdirSync('./tests/temp/saveLoad', { recursive: true });
    let handlerAgent: HandlerAgent;
    const testHandle: string | undefined =
        process.env.TEST_HANDLE ?? 'testhandle';
    const testPassword: string | undefined =
        process.env.TEST_PASSWORD ?? 'testpassword';

    const sessionData: AtpSessionData = {
        did: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
        // Add any other necessary fields for AtpSessionData
    } as AtpSessionData;
    const malformedSessionData = '{ malformed JSON }';
    const sessionFilePath = './agentName-session.json';

    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {
            handlerAgent = new HandlerAgent(
                'agentName',
                testHandle,
                testPassword
            );
        }

        // Clear any existing session files before each test
        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });

    afterEach(() => {
        // Clean up any session files after each test
        if (fs.existsSync(handlerAgent.getSessionLocation())) {
            fs.unlinkSync(handlerAgent.getSessionLocation());
        }
    });
    afterAll(() => {
        fs.rmSync('./tests/temp/saveLoad', { recursive: true, force: true });
    });

    it('should load existing session data if the session file exists', async () => {
        fs.writeFileSync(
            handlerAgent.getSessionLocation(),
            JSON.stringify(sessionData),
            'utf8'
        );

        const debugLogSpy = jest.spyOn(DebugLog, 'warn');
        const resumeMock = jest.fn();
        const loginMock = jest.fn();
        // @ts-ignore
        handlerAgent.agent.resumeSession = resumeMock;
        // @ts-ignore
        handlerAgent.agent.login = loginMock;
        await handlerAgent.authenticate();

        expect(debugLogSpy).toHaveBeenCalledWith(
            'AGENT',
            'Existing session. Loading session'
        );
        expect(handlerAgent['session']).toEqual(sessionData); // Access private properties using bracket notation
        debugLogSpy.mockRestore();
        expect(resumeMock).toBeCalledWith(handlerAgent.getSession);
    });

    it('should log an error and resolve undefined if session data parsing fails', async () => {
        fs.writeFileSync(
            handlerAgent.getSessionLocation(),
            malformedSessionData,
            'utf8'
        );

        const debugLogSpy = jest.spyOn(DebugLog, 'error');

        const loadedSession = await handlerAgent.loadSessionData();

        expect(debugLogSpy).toHaveBeenCalledWith(
            'AGENT',
            expect.stringContaining('Failed to parse session data.')
        );
        expect(loadedSession).toBeUndefined();

        debugLogSpy.mockRestore();
    });

    it('should save session data', async () => {
        await handlerAgent.saveSessionData(sessionData);
        const savedData = JSON.parse(
            fs.readFileSync(handlerAgent.getSessionLocation(), 'utf8')
        );
        expect(savedData).toEqual(sessionData);
    });

    it('should return undefined if the session file does not exist', async () => {
        const loadedSession = await handlerAgent.loadSessionData();
        expect(loadedSession).toBeUndefined();
    });

    it('should load session data when file exists', async () => {
        fs.writeFileSync(
            handlerAgent.getSessionLocation(),
            JSON.stringify(sessionData),
            'utf8'
        );
        const loadedSession = await handlerAgent.loadSessionData();
        expect(loadedSession).toEqual(sessionData);
    });

    it('should handle error when saving session data if writing fails', async () => {
        jest.spyOn(fs, 'writeFile').mockImplementationOnce(
            (_, __, callback) => {
                callback(new Error('Failed to save'));
            }
        );

        await expect(handlerAgent.saveSessionData(sessionData)).rejects.toThrow(
            'Failed to save'
        );
    });

    it('should handle error when loading session data if reading fails', async () => {
        fs.writeFileSync(
            handlerAgent.getSessionLocation(),
            JSON.stringify(sessionData),
            'utf8'
        );

        // @ts-ignore
        jest.spyOn(fs, 'readFile').mockImplementationOnce((_, __, callback) => {
            callback(new Error('Failed to read'), null as unknown as Buffer);
        });

        const loadedSession = await handlerAgent.loadSessionData();
        expect(loadedSession).toBeUndefined();
    });
});
