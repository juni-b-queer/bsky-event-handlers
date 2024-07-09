import { RawData, WebSocket } from 'ws';
import {
    CreateMessage,
    DebugLog,
    DeleteMessage,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
    MessageHandler,
} from '../../src';

describe('JetstreamSubscription', () => {
    let mockHandlers: JetstreamSubscriptionHandlers;
    let subscription: JetstreamSubscription;

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
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('handleMessage', () => {
        it("should handle 'c' opType", () => {
            const mockCreateMessage: CreateMessage = {
                collection: 'app.bsky.feed.post',
                record: {
                    $type: 'app.bsky.feed.post',
                    createdAt: '',
                },
                did: '',
                seq: 1,
                opType: 'c',
                cid: '',
                rkey: '',
            };

            const mockHandler: Partial<MessageHandler> = {
                handle: jest.fn(),
            };

            mockHandlers.post!.c = [mockHandler as MessageHandler];

            subscription.handleMessage(
                JSON.stringify({
                    ...mockCreateMessage,
                    opType: 'c',
                }) as unknown as RawData,
                false
            );

            expect(mockHandler.handle).toHaveBeenCalledWith(
                undefined,
                mockCreateMessage
            );
        });

        it("should handle 'd' opType", () => {
            const mockDeleteMessage: DeleteMessage = {
                collection: 'app.bsky.feed.post',
                did: '',
                seq: 1,
                opType: 'd',
                rkey: '',
                cid: '',
            };

            const mockHandler: Partial<MessageHandler> = {
                handle: jest.fn(),
            };

            mockHandlers.post!.d = [mockHandler as MessageHandler];

            subscription.handleMessage(
                JSON.stringify({
                    ...mockDeleteMessage,
                    opType: 'd',
                }) as unknown as RawData,
                false
            );

            expect(mockHandler.handle).toHaveBeenCalledWith(
                undefined,
                mockDeleteMessage
            );
        });
    });
});

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

    it('calls debug when closed', () => {
        const closeMock = jest.fn();
        subscription.wsClient = {
            close: closeMock,
        } as unknown as WebSocket;

        subscription.handleClose();
        expect(mockDebugError).toHaveBeenCalledWith(
            'JETSTREAM',
            'Subscription Closed'
        );
        expect(closeMock).toHaveBeenCalled();
    });
});
