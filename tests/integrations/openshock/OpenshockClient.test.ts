// Mock debug log
import {
    DebugLog,
    OpenshockClient,
    OpenshockControlSchema,
} from '../../../src';

DebugLog.warn = jest.fn();

global.fetch = jest.fn();

describe('OpenshockClient', () => {
    const apiToken = 'test-token';
    const baseUrl = 'https://api.openshock.test';
    let client: OpenshockClient;

    beforeEach(() => {
        client = new OpenshockClient(apiToken, baseUrl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should send control request and return true on success', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({}),
        });

        const requestBody = {
            customName: 'test',
            shocks: [] as OpenshockControlSchema[],
        };
        const result = await client.sendControlRequest(requestBody);

        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/2/shockers/control`,
            expect.any(Object)
        );
    });

    test('should return false and log warning on control request failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({ errors: ['error'] }),
        });

        const requestBody = {
            customName: 'test',
            shocks: [] as OpenshockControlSchema[],
        };
        const result = await client.sendControlRequest(requestBody);

        expect(result).toBe(false);
        expect(DebugLog.warn).toHaveBeenCalledWith(
            'OPENSHOCK CLIENT',
            JSON.stringify(['error'], null, 2)
        );
    });

    test('should handle API v1 GET request', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: 'success' }),
        });

        const result = await client.sendApiV1Request('GET', 'test-route');

        expect(result).toBe('success');
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/1/test-route`,
            expect.any(Object)
        );
    });

    test('should handle API v1 POST request', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: 'success' }),
        });

        const result = await client.sendApiV1Request('POST', 'test-route', {
            test: 'test',
        });

        expect(result).toBe('success');
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/1/test-route`,
            expect.any(Object)
        );
    });

    test('should handle API v1 PUT request', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: 'success' }),
        });

        const result = await client.sendApiV1Request('PUT', 'test-route', {
            test: 'test',
        });

        expect(result).toBe('success');
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/1/test-route`,
            expect.any(Object)
        );
    });

    test('should handle API v1 PATCH request', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: 'success' }),
        });

        const result = await client.sendApiV1Request('PATCH', 'test-route', {
            test: 'test',
        });

        expect(result).toBe('success');
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/1/test-route`,
            expect.any(Object)
        );
    });

    test('should return errors and log warning on API v1 request failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({ errors: ['error'] }),
        });

        const result = await client.sendApiV1Request('GET', 'test-route');

        expect(result).toStrictEqual(['error']);
        expect(DebugLog.warn).toHaveBeenCalledWith(
            'OPENSHOCK CLIENT',
            JSON.stringify(['error'], null, 2)
        );
    });

    test('should get own shockers', async () => {
        const shockerResponse = [
            {
                id: '1',
                name: 'controller1',
                shockers: [
                    { name: 'shocker1', id: 'shocker1-id' },
                    { name: 'shocker2', id: 'shocker2-id' },
                ],
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: shockerResponse }),
        });

        const result = await client.getShockers('own');

        expect(result).toEqual([
            {
                name: 'shocker1',
                id: 'shocker1-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
            {
                name: 'shocker2',
                id: 'shocker2-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
        ]);
    });

    test('should get shared shockers', async () => {
        const shockerResponse = [
            {
                id: '2',
                name: 'controller2',
                shockers: [
                    { name: 'shocker3', id: 'shocker3-id' },
                    { name: 'shocker4', id: 'shocker4-id' },
                ],
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: shockerResponse }),
        });

        const result = await client.getShockers('shared');

        expect(result).toEqual([
            {
                name: 'shocker3',
                id: 'shocker3-id',
                controllerId: '2',
                controllerName: 'controller2',
            },
            {
                name: 'shocker4',
                id: 'shocker4-id',
                controllerId: '2',
                controllerName: 'controller2',
            },
        ]);
    });

    test('should get own shockers by hub', async () => {
        const shockerResponse = [
            {
                id: '1',
                name: 'controller1',
                shockers: [
                    { name: 'shocker1', id: 'shocker1-id' },
                    { name: 'shocker2', id: 'shocker2-id' },
                ],
            },
            {
                id: '2',
                name: 'controller2',
                shockers: [
                    { name: 'shocker3', id: 'shocker3-id' },
                    { name: 'shocker4', id: 'shocker4-id' },
                ],
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: shockerResponse }),
        });

        const result = await client.getShockers('own', '1');

        expect(result).toEqual([
            {
                name: 'shocker1',
                id: 'shocker1-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
            {
                name: 'shocker2',
                id: 'shocker2-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
        ]);
    });

    test('should get own shockers by default', async () => {
        const shockerResponse = [
            {
                id: '1',
                name: 'controller1',
                shockers: [
                    { name: 'shocker1', id: 'shocker1-id' },
                    { name: 'shocker2', id: 'shocker2-id' },
                ],
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ data: shockerResponse }),
        });

        const result = await client.getShockers();

        expect(result).toEqual([
            {
                name: 'shocker1',
                id: 'shocker1-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
            {
                name: 'shocker2',
                id: 'shocker2-id',
                controllerId: '1',
                controllerName: 'controller1',
            },
        ]);
        expect(fetch).toHaveBeenCalledWith(
            `${baseUrl}/1/shockers/own`,
            expect.any(Object)
        );
    });

    test('should get owned shockers from names', async () => {
        jest.spyOn(client, 'getShockers').mockResolvedValue([
            { name: 'shocker1', id: 'shocker1-id' },
            { name: 'shocker2', id: 'shocker2-id' },
        ]);

        const result = await client.getOwnedShockersFromNames('shocker1');

        expect(result).toEqual([{ name: 'shocker1', id: 'shocker1-id' }]);
    });

    test('should get shocker ID from name', async () => {
        jest.spyOn(client, 'getShockers').mockResolvedValue([
            { name: 'shocker1', id: 'shocker1-id' },
        ]);

        const result = await client.getShockerIDFromName('shocker1');

        expect(result).toBe('shocker1-id');
    });

    test('should return null if no shocker name matches', async () => {
        jest.spyOn(client, 'getShockers').mockResolvedValue([
            { name: 'shocker1', id: 'shocker1-id' },
        ]);

        const result = await client.getShockerIDFromName('nonexistent');

        expect(result).toBeNull();
    });
});
