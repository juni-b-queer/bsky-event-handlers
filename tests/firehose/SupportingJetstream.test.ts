import {
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
    DebugLog,
} from '../../src';

// Mock the entire 'ws' module and its WebSocket constructor
jest.mock('ws', () => {
    const mockWebSocket = jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        close: jest.fn(),
    }));

    return { WebSocket: mockWebSocket };
});

describe('JetstreamSubscription', () => {
    let mockHandlers: JetstreamSubscriptionHandlers;
    let subscription: JetstreamSubscription;
    const mockDebugInfo = jest.fn();
    const mockDebugError = jest.fn();

    beforeEach(() => {
        mockHandlers = {
            post: { c: [], d: [] },
            like: { c: [], d: [] },
            repost: { c: [], d: [] },
            follow: { c: [], d: [] },
        };

        subscription = new JetstreamSubscription(
            mockHandlers,
            'ws://localhost'
        );

        // Mock the DebugLog methods
        DebugLog.info = mockDebugInfo;
        DebugLog.error = mockDebugError;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls debug when opened', () => {
        subscription.handleOpen();
        expect(mockDebugInfo).toHaveBeenCalledWith(
            'FIREHOSE',
            'Connection Opened'
        );
    });

    it('handles errors correctly', () => {
        const testError = new Error('Test error');
        subscription.handleError(testError);
        expect(mockDebugError).toHaveBeenCalledWith(
            'FIREHOSE',
            'Error: Test error'
        );
        expect(subscription.restart).toBe(true);
    });
});
