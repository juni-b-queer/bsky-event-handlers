import ws from 'ws';
import {
    DebugLog,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
} from '../../src'; // import this if you have it installed

describe('JetstreamSubscription createSubscription', () => {
    let server: ws.Server | null;
    let jetstreamSub: JetstreamSubscription;
    const wsURL = 'ws://localhost:1234';
    const handlers: JetstreamSubscriptionHandlers = {}; // fill in handlers required for testing
    const warnMock = jest.fn();
    const errorMock = jest.fn();
    const openSubMock = jest.fn();
    const handleCreateMock = jest.fn();
    const handleDeleteMock = jest.fn();

    beforeEach(() => {
        server = new ws.Server({ port: 1234 });
        jetstreamSub = new JetstreamSubscription(handlers, wsURL);
        jetstreamSub.handleOpen = openSubMock;
        jetstreamSub.handleCreate = handleCreateMock;
        jetstreamSub.handleDelete = handleDeleteMock;

        DebugLog.warn = warnMock;
        DebugLog.error = errorMock;
    });
    afterEach(() => {
        server?.close();
        server = null;
        jest.clearAllMocks();
    });

    it(
        'Should run create subscription',
        async () => {
            const returnedSub = jetstreamSub.createSubscription();
            expect(warnMock).toHaveBeenCalled();
            expect(typeof returnedSub).toBe('object');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Expect the handleError not to have been called
            expect(errorMock).not.toHaveBeenCalled();
            expect(openSubMock).toHaveBeenCalled();

            server?.clients.forEach((client) => {
                // @ts-ignore
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(Buffer.from(JSON.stringify({ opType: 'c' })), {
                        binary: true,
                    });
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));

            expect(handleCreateMock).toHaveBeenCalled();

            server?.clients.forEach((client) => {
                // @ts-ignore
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(Buffer.from(JSON.stringify({ opType: 'd' })), {
                        binary: true,
                    });
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));

            expect(handleDeleteMock).toHaveBeenCalled();

            const createSubscriptionMock = jest.fn();
            jetstreamSub.createSubscription = createSubscriptionMock;
            jetstreamSub.restartDelay = 1;
            jetstreamSub.stopSubscription(true);

            await new Promise((resolve) => setTimeout(resolve, 500));

            expect(errorMock).toHaveBeenCalled();
            expect(warnMock).toHaveBeenCalled();

            await new Promise((resolve) => setTimeout(resolve, 1000));

            expect(createSubscriptionMock).toHaveBeenCalled();
        },
        1000 * 10
    );
});
