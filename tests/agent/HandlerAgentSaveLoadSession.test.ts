import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { DebugLog, HandlerAgent } from '../../src';
import { AtpSessionData } from '@atproto/api';

dotenv.config();

describe('HandlerAgent Session Management', () => {
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
    const sessionFilePath = path.join('.', 'agentName-session.json');

    beforeEach(() => {
        if (testHandle !== undefined && testPassword !== undefined) {
            handlerAgent = new HandlerAgent(
                'agentName',
                testHandle,
                testPassword
            );
        }

        // Clear any existing session files before each test
        if (fs.existsSync(sessionFilePath)) {
            fs.unlinkSync(sessionFilePath);
        }
    });

    afterEach(() => {
        // Clean up any session files after each test
        if (fs.existsSync(sessionFilePath)) {
            fs.unlinkSync(sessionFilePath);
        }
    });

    it('should load existing session data if the session file exists', async () => {
        fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData), 'utf8');

        const debugLogSpy = jest.spyOn(DebugLog, 'warn');
        const resumeMock = jest.fn();
        // @ts-ignore
        handlerAgent.agent.resumeSession = resumeMock;
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
        fs.writeFileSync(sessionFilePath, malformedSessionData, 'utf8');

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
        const savedData = JSON.parse(fs.readFileSync(sessionFilePath, 'utf8'));
        expect(savedData).toEqual(sessionData);
    });

    it('should return undefined if the session file does not exist', async () => {
        const loadedSession = await handlerAgent.loadSessionData();
        expect(loadedSession).toBeUndefined();
    });

    it('should load session data when file exists', async () => {
        fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData), 'utf8');
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
        fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData), 'utf8');

        // @ts-ignore
        jest.spyOn(fs, 'readFile').mockImplementationOnce((_, __, callback) => {
            callback(new Error('Failed to read'), null as unknown as Buffer);
        });

        const loadedSession = await handlerAgent.loadSessionData();
        expect(loadedSession).toBeUndefined();
    });
});
