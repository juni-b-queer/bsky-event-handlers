import { WebSocket } from 'ws';
import {
    DebugLog,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
} from '../../src';

describe('JetstreamSubscription', () => {
    let mockHandlers: JetstreamSubscriptionHandlers;
    let subscription: JetstreamSubscription;
    const mockDebugInfo = jest.fn();
    const mockDebugError = jest.fn();

    beforeEach(() => {
        jest.spyOn(WebSocket.prototype, 'on').mockImplementation(jest.fn());

        mockHandlers = {
            post: { c: [], d: [] },
            like: { c: [], d: [] },
            repost: { c: [], d: [] },
            follow: { c: [], d: [] },
        };

        // websocket url can be anything, considering it's a mock
        subscription = new JetstreamSubscription(mockHandlers, 'url');
        DebugLog.info = mockDebugInfo;
        DebugLog.error = mockDebugError;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('calls debug when opened', () => {
        subscription.handleOpen();
        expect(mockDebugInfo).toHaveBeenCalledWith(
            'FIREHOSE',
            'Connection Opened'
        );
    });
});
