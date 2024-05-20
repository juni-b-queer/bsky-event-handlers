import {
    CreateMessage,
    CreateMessageFactory,
    DeleteMessage,
    JetstreamMessageFactory,
    JetstreamSubscription,
    JetstreamSubscriptionHandlers,
    MessageHandler,
    Record,
} from '../../src';

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
        jetSub = new JetstreamSubscription(
            handlers,
            'ws://localhost:6008/subscribe'
        );
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

        const msg: CreateMessage = CreateMessageFactory.make();
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleCreate like', () => {
        // @ts-ignore
        handlers.like.c = [dummyHandler];

        const msg: CreateMessage = CreateMessageFactory.factory()
            .collection('app.bsky.feed.like')
            .create();
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleCreate repost', () => {
        // @ts-ignore
        handlers.repost.c = [dummyHandler];

        const msg: CreateMessage = CreateMessageFactory.factory()
            .collection('app.bsky.feed.repost')
            .create();
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleCreate follow', () => {
        // @ts-ignore
        handlers.follow.c = [dummyHandler];

        const msg: CreateMessage = CreateMessageFactory.factory()
            .collection('app.bsky.graph.follow')
            .create();
        jetSub.handleCreate(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleDelete post', () => {
        // @ts-ignore
        handlers.post.d = [dummyHandler];
        const msg: DeleteMessage = JetstreamMessageFactory.factory()
            .collection('app.bsky.feed.post')
            .isDeletion()
            .create();
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleDelete like', () => {
        // @ts-ignore
        handlers.like.d = [dummyHandler];
        const msg: DeleteMessage = JetstreamMessageFactory.factory()
            .collection('app.bsky.feed.like')
            .isDeletion()
            .create();
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleDelete repost', () => {
        // @ts-ignore
        handlers.repost.d = [dummyHandler];
        const msg: DeleteMessage = JetstreamMessageFactory.factory()
            .collection('app.bsky.feed.repost')
            .isDeletion()
            .create();
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });

    test('handleDelete follow', () => {
        // @ts-ignore
        handlers.follow.d = [dummyHandler];
        const msg: DeleteMessage = JetstreamMessageFactory.factory()
            .collection('app.bsky.graph.follow')
            .isDeletion()
            .create();
        jetSub.handleDelete(msg);
        expect(dummyHandler.handle).toHaveBeenCalledTimes(1);
        expect(dummyHandler.handle).toHaveBeenCalledWith(msg);
    });
});
