import {
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
    MessageHandler,
} from '../../src';
import WebSocket from 'ws';

describe('JetstreamSubscription', () => {
    let jetSub: JetstreamSubscription;
    const handlers: JetstreamSubscriptionHandlers = {
        post: {
            c: [],
            d: [],
        },
        like: {
            c: [],
            d: [],
        },
        repost: {
            c: [],
            d: [],
        },
        follow: {
            c: [],
            d: [],
        },
    };
    // A dummy message handler for testing
    const dummyHandler: MessageHandler = {
        handle: jest.fn(),
    } as unknown as MessageHandler;

    beforeEach(() => {
        jetSub = new JetstreamSubscription(handlers);
        (dummyHandler.handle as jest.Mock).mockClear();
    });

    test('set setWsURL', () => {
        const newUrl = 'ws://localhost:6009/subscribe';
        jetSub.setWsURL = newUrl;
        expect((jetSub as any).wsURL).toBe(newUrl);
    });

    test('generateWsURL', () => {
        handlers.post = {
            c: [dummyHandler],
            d: [dummyHandler],
        };
        jetSub.setWsURL = 'ws://localhost:6010/subscribe';
        jetSub.generateWsURL();
        expect((jetSub as any).wsURL).toContain('post');
    });

    test('handleCreate post', () => {
        // @ts-ignore
        handlers.post.c = [dummyHandler];

        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleCreate like', () => {
        // @ts-ignore
        handlers.like.c = [dummyHandler];

        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.like')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleCreate repost', () => {
        // @ts-ignore
        handlers.repost.c = [dummyHandler];

        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.repost')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleCreate follow', () => {
        // @ts-ignore
        handlers.follow.c = [dummyHandler];

        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.graph.follow')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleDelete post', () => {
        // @ts-ignore
        handlers.post.d = [dummyHandler];
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.feed.post')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleDelete like', () => {
        // @ts-ignore
        handlers.like.d = [dummyHandler];
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.feed.like')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleDelete repost', () => {
        // @ts-ignore
        handlers.repost.d = [dummyHandler];
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.feed.repost')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });

    test('handleDelete follow', () => {
        // @ts-ignore
        handlers.follow.d = [dummyHandler];
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.graph.follow')
                    .create()
            )
            .create() as JetstreamEventCommit;
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(undefined, msg);
    });
});

describe('JetstreamSubscription', () => {
    let jetSub: JetstreamSubscription;
    const handlers: JetstreamSubscriptionHandlers = {
        post: {
            c: [],
            d: [],
        },
        like: {
            c: [],
            d: [],
        },
        repost: {
            c: [],
            d: [],
        },
        follow: {
            c: [],
            d: [],
        },
    };
    // A dummy message handler for testing
    const dummyHandler: MessageHandler = {
        handle: jest.fn(),
    } as unknown as MessageHandler;

    const closeMock = jest.fn();

    beforeEach(() => {
        jetSub = new JetstreamSubscription(
            handlers,
            'ws://localhost:6008/subscribe'
        );

        jetSub.wsClient = { close: closeMock } as unknown as WebSocket;
        (dummyHandler.handle as jest.Mock).mockClear();
    });

    test('close sub closes it', () => {
        jetSub.stopSubscription();
        expect(closeMock).toHaveBeenCalled();
    });
});
