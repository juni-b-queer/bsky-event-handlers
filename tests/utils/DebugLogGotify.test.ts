import {debugLog, DebugLog, GotifyClient} from "../../src";
import mocked = jest.mocked;

describe('DebugLog gotify function test', () => {
    const gotifyApiToken = 'gotifyAppToken';
    const gotifyServerUrl = 'https://examplegotify.com';
    const mockGotifyClient = new GotifyClient(gotifyApiToken, gotifyServerUrl);
    const mockSendMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockGotifyClient.sendMessage = mockSendMessage;
        delete process.env.GOTIFY_API_TOKEN;
        delete process.env.GOTIFY_SERVER_URL;

        // mocked(process.env, { shallow: true }).GOTIFY_API_TOKEN = undefined;
        // mocked(process.env, { shallow: true }).GOTIFY_SERVER_URL = undefined;
    });


    it('should throw an error when API token is missing', () => {
        mocked(process.env, { shallow: true }).GOTIFY_SERVER_URL = gotifyServerUrl;
        expect(() => {
            DebugLog.generateDefaultGotifyClient();
        }).toThrow('Gotify API Token and Base URL are required to enable Gotify Debug Logging');
    });

    it('should throw an error when server URL is missing', () => {
        mocked(process.env, { shallow: true }).GOTIFY_API_TOKEN = gotifyApiToken;
        expect(() => {
            DebugLog.generateDefaultGotifyClient();
        }).toThrow('Gotify API Token and Base URL are required to enable Gotify Debug Logging');
    });

    it('should throw an error when both API token and server URL are missing', () => {
        expect(() => {
            DebugLog.generateDefaultGotifyClient();
        }).toThrow('Gotify API Token and Base URL are required to enable Gotify Debug Logging');
    });

    it('should create a GotifyClient with valid environment variables', () => {
        mocked(process.env, { shallow: true }).GOTIFY_API_TOKEN = gotifyApiToken;
        mocked(process.env, { shallow: true }).GOTIFY_SERVER_URL = gotifyServerUrl;

        const client = DebugLog.generateDefaultGotifyClient();

        expect(client).toBeInstanceOf(GotifyClient);
    });

    it('should call setGotifyClient if undefined', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const setClientSpy = jest.spyOn(DebugLog, 'setGotifyClient')
        const getClientSpy = jest.spyOn(DebugLog, 'getGotifyClient')
        DebugLog.generateDefaultGotifyClient = jest.fn().mockReturnValue(mockGotifyClient);

        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'false';
        mocked(process.env, { shallow: true }).GOTIFY_DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).GOTIFY_DEBUG_LOG_LEVEL = 'info';
        mocked(process.env, { shallow: true }).GOTIFY_SERVER_URL =
            gotifyServerUrl;
        mocked(process.env, { shallow: true }).GOTIFY_API_TOKEN =
            gotifyApiToken;

        const action = 'Action';
        const message = 'Test message';

        DebugLog.log(action, message, 'info');

        expect(getClientSpy).toHaveBeenCalled()
        expect(setClientSpy).toHaveBeenCalled();
        expect(mockSendMessage).toHaveBeenCalledWith(`info: ${action}`, message);
        DebugLog.setGotifyClient(mockGotifyClient);

        expect(setClientSpy).toHaveBeenCalledTimes(2);
    });

    it('should not call setGotifyClient if defined', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const setClientSpy = jest.spyOn(DebugLog, 'setGotifyClient')
        const getClientSpy = jest.spyOn(DebugLog, 'getGotifyClient')
        DebugLog.setGotifyClient(mockGotifyClient);

        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'false';
        mocked(process.env, { shallow: true }).GOTIFY_DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).GOTIFY_DEBUG_LOG_LEVEL = 'info';
        mocked(process.env, { shallow: true }).GOTIFY_SERVER_URL =
            gotifyServerUrl;
        mocked(process.env, { shallow: true }).GOTIFY_API_TOKEN =
            gotifyApiToken;

        const action = 'Action';
        const message = 'Test message';

        DebugLog.log(action, message, 'info');

        expect(getClientSpy).toHaveBeenCalled()
        expect(setClientSpy).toHaveBeenCalledTimes(1);
        expect(mockSendMessage).toHaveBeenCalledWith(`info: ${action}`, message);
    });

});