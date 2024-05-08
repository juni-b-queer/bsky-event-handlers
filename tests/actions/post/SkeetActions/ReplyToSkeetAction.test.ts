import {
    CreateSkeetMessage,
    CreateSkeetRecord,
    HandlerAgent,
    Reply,
    ReplyToSkeetAction,
    ReplyToSkeetWithGeneratedTextAction,
} from '../../../../src';

describe('Reply To Skeet Action', () => {
    let action: ReplyToSkeetAction;
    let handlerAgent: HandlerAgent;
    let message: CreateSkeetMessage;
    const mockCreateSkeet = jest.fn();
    const mockReply: Reply = {
        root: {
            cid: '',
            uri: '',
        },
        parent: {
            cid: '',
            uri: '',
        },
    };
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const skeetText: string = 'Test Text';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        message = {
            record: {} as CreateSkeetRecord,
            collection: 'app.bsky.feed.post',
            did: 'did:plc:did',
            opType: 'c',
            rkey: 'rkey',
            seq: 0,
            cid: 'cid',
        };
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
    const mockTextGenerator = jest.fn().mockReturnValue('hello');
    const mockCreateSkeet = jest.fn();
    const mockReply: Reply = {
        root: {
            cid: '',
            uri: '',
        },
        parent: {
            cid: '',
            uri: '',
        },
    };
    const mockGenerateReplyFromMessage = jest.fn().mockReturnValue(mockReply);

    const skeetText: string = 'Test Text';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
            generateReplyFromMessage: mockGenerateReplyFromMessage,
        } as unknown as HandlerAgent;
        message = {
            record: {} as CreateSkeetRecord,
            collection: 'app.bsky.feed.post',
            did: 'did:plc:did',
            opType: 'c',
            rkey: 'rkey',
            seq: 0,
            cid: 'cid',
        };
        action = ReplyToSkeetWithGeneratedTextAction.make(mockTextGenerator);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        await action.handle(message, handlerAgent);
        expect(mockTextGenerator).toHaveBeenCalledWith(message, handlerAgent);
        expect(mockCreateSkeet).toHaveBeenCalledWith('hello', mockReply);
    });
});
