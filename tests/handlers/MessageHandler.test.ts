import {
    AbstractMessageAction,
    AbstractValidator,
    CreateSkeetMessage,
    DebugLog,
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
    MessageHandler,
} from '../../src';

describe('MessageHandler', () => {
    let messageHandler: MessageHandler;
    let mockedHandlerAgent: HandlerAgent;
    let mockedValidators: AbstractValidator[];
    let mockedActions: AbstractMessageAction[];
    let mockValidatorShouldTrigger: jest.Mock<any, any, any>;
    let mockActionHandle: jest.Mock<any, any, any>;
    let mockDebugError: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockDebugError = jest.fn();
        DebugLog.error = mockDebugError;
        mockValidatorShouldTrigger = jest
            .fn()
            .mockImplementation(
                (message: CreateSkeetMessage, agent: HandlerAgent) => {
                    return message.opType === 'c';
                }
            );
        mockActionHandle = jest
            .fn()
            .mockImplementation(
                (message: CreateSkeetMessage, agent: HandlerAgent) => {
                    if (message.seq === 3) {
                        throw new Error('error');
                    }
                    return;
                }
            );
        mockedHandlerAgent = {} as HandlerAgent;
        mockedValidators = [
            {
                shouldTrigger: mockValidatorShouldTrigger,
            } as unknown as AbstractValidator,
        ];
        mockedActions = [
            {
                handle: mockActionHandle,
            } as unknown as AbstractMessageAction,
        ];
        messageHandler = MessageHandler.make(
            mockedValidators,
            mockedActions,
            mockedHandlerAgent
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handle', () => {
        it('should run actions when opType is c', async () => {
            //make CreateSkeetMessage
            const message: JetstreamMessage = JetstreamMessageFactory.make();
            await messageHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalledWith(
                message,
                mockedHandlerAgent
            );
        });

        it('should run not actions when opType is d', async () => {
            const message: JetstreamMessage = JetstreamMessageFactory.factory()
                .isDeletion()
                .create();
            await messageHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should debug log error when handle throws error', async () => {
            const message: JetstreamMessage = JetstreamMessageFactory.factory()
                .seq(3)
                .create();
            await messageHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
