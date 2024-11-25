import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    JetstreamReply,
    ReplyFactory,
    ReplyToSkeetAction,
    ReplyToSkeetWithGeneratedTextAction,
} from '../../../../src';

describe('JetstreamReply To Skeet Action', () => {
    let action: ReplyToSkeetAction;
    let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const mockCreateSkeet = jest.fn();
    const mockReply: JetstreamReply = ReplyFactory.factory().create();
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const skeetText: string = 'Test Text';
    const did: string = 'did:plc:did';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        message = CreateSkeetMessageFactory.factory().fromDid(did).create();
        action = ReplyToSkeetAction.make(skeetText);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        await action.handle(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});

describe('JetstreamReply To Skeet with generated text Action', () => {
    let action: ReplyToSkeetWithGeneratedTextAction;
    let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const skeetText: string = 'Test Text';
    const mockTextGenerator = jest.fn().mockReturnValue(skeetText);
    const mockCreateSkeet = jest.fn();
    const mockReply: JetstreamReply = ReplyFactory.factory().create();
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const did: string = 'did:plc:did';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        message = CreateSkeetMessageFactory.factory().fromDid(did).create();
        action = ReplyToSkeetWithGeneratedTextAction.make(mockTextGenerator);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        await action.handle(handlerAgent, message);
        expect(mockTextGenerator).toHaveBeenCalledWith(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});
