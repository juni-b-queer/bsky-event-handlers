import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    Reply,
    ReplyFactory,
    ReplyToSkeetAction,
    ReplyToSkeetWithGeneratedTextAction,
} from '../../../../src';

describe('Reply To Skeet Action', () => {
    let action: ReplyToSkeetAction;
    let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const mockCreateSkeet = jest.fn();
    const mockReply: Reply = ReplyFactory.factory().create();
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
        await action.handle(message, handlerAgent);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});

describe('Reply To Skeet with generated text Action', () => {
    let action: ReplyToSkeetWithGeneratedTextAction;
    let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const skeetText: string = 'Test Text';
    const mockTextGenerator = jest.fn().mockReturnValue(skeetText);
    const mockCreateSkeet = jest.fn();
    const mockReply: Reply = ReplyFactory.factory().create();
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
        await action.handle(message, handlerAgent);
        expect(mockTextGenerator).toHaveBeenCalledWith(message, handlerAgent);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, mockReply);
    });
});
