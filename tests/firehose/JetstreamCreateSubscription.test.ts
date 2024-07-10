import ws from 'ws';
import {
    DebugLog,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
} from '../../src'; // import this if you have it installed

describe('JetstreamSubscription createSubscription', () => {
    let server: ws.Server;
    let jetstreamSub: JetstreamSubscription;
    const wsURL = 'ws://localhost:1234';
    const handlers: JetstreamSubscriptionHandlers = {}; // fill in handlers required for testing
    const warnMock = jest.fn();
    const openSubMock = jest.fn();
    const closeSubMock = jest.fn();
    const messageSubMock = jest.fn();
    const errorSubMock = jest.fn();

    beforeEach(() => {
        server = new ws.Server({ port: 1234 });
        jetstreamSub = new JetstreamSubscription(handlers, wsURL);
        jetstreamSub.handleOpen = openSubMock;
        jetstreamSub.handleClose = closeSubMock;
        jetstreamSub.handleMessage = messageSubMock;
        jetstreamSub.handleError = errorSubMock;

        DebugLog.warn = warnMock;
    });
    afterEach(() => {
        server.close();
    });

    it(
        'Should run create subscription',
        async () => {
            const returnedSub = jetstreamSub.createSubscription();
            expect(warnMock).toHaveBeenCalled();
            expect(typeof returnedSub).toBe('object');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Expect the handleError not to have been called
            expect(errorSubMock).not.toHaveBeenCalled();
            expect(openSubMock).toHaveBeenCalled();

            server.clients.forEach((client) => {
                // @ts-ignore
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(Buffer.from(JSON.stringify({ opType: 'c' })), {
                        binary: true,
                    });
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));

            expect(messageSubMock).toHaveBeenCalled();

            jetstreamSub.stopSubscription();
        },
        1000 * 10
    );
});
