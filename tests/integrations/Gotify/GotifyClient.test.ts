// Mock debug log
import {
    DebugLog,
    OpenshockClient,
    OpenshockControlSchema,
} from '../../../src';
import {GotifyClient} from "../../../src/integrations/gotify/GotifyClient";

DebugLog.warn = jest.fn();

global.fetch = jest.fn();

describe('GotifyClient', () => {
    const apiToken = 'test-token';
    const baseUrl = 'https://gotify.test';
    let client: GotifyClient;

    beforeEach(() => {
        client = new GotifyClient(apiToken, baseUrl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should send message return true on success', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({}),
        });

        const title = 'test';
        const message = 'test';
        const result = await client.sendMessage(title, message);

        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/message`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify({
                    title: title,
                    message: message,
                    priority: 1,
                }),
            }
        );
    });

    test('should send message with non-default priority return true on success', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({}),
        });

        const title = 'test';
        const message = 'test';
        const priority = 2;
        const result = await client.sendMessage(title, message, priority);

        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/message`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`,
                },
                body: JSON.stringify({
                    title: title,
                    message: message,
                    priority: priority,
                }),
            }
        );
    });

    test('should return false and log warning on message request failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({ errors: ['error'] }),
        });

        const title = 'test';
        const message = 'test';
        const result = await client.sendMessage(title, message);

        expect(result).toBe(false);
        expect(DebugLog.warn).toHaveBeenCalledWith(
            'GOTIFY CLIENT',
            JSON.stringify(['error'], null, 2)
        );
    });
});
