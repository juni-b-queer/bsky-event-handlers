import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamReply,
    NewSkeetRecordFactory,
    ReplyFactory,
    ReplyToSkeetAction,
    ReplyToSkeetWithGeneratedTextAction,
} from '../../../../src';

describe('JetstreamReply To Skeet Action', () => {
    let action: ReplyToSkeetAction;
    let handlerAgent: HandlerAgent;
    const mockCreateSkeet = jest.fn();
    const mockReply: JetstreamReply = ReplyFactory.factory().create();
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const skeetText: string = 'Test Text';
    const did: string = 'did:plc:did';

    const createMessage = (did: string) => {
        return JetstreamEventFactory.factory()
            .fromDid(did)
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(
                        NewSkeetRecordFactory.factory()

                            .create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        action = ReplyToSkeetAction.make(skeetText);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        const message = createMessage(did);
        await action.handle(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});

describe('JetstreamReply To Skeet with generated text Action', () => {
    let action: ReplyToSkeetWithGeneratedTextAction;
    let handlerAgent: HandlerAgent;
    const skeetText: string = 'Test Text';
    const mockTextGenerator = jest.fn().mockReturnValue(skeetText);
    const mockCreateSkeet = jest.fn();
    const mockReply: JetstreamReply = ReplyFactory.factory().create();
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const did: string = 'did:plc:did';

    const createMessage = (did: string) => {
        return JetstreamEventFactory.factory()
            .fromDid(did)
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(
                        NewSkeetRecordFactory.factory()

                            .create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        action = ReplyToSkeetWithGeneratedTextAction.make(mockTextGenerator);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        const message = createMessage(did);
        await action.handle(handlerAgent, message);
        expect(mockTextGenerator).toHaveBeenCalledWith(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});
