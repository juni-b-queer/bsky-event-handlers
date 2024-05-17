import {
    AbstractMessageAction,
    AbstractValidator,
    CreateSkeetHandler,
    CreateSkeetMessage, CreateSkeetMessageFactory,
    CreateSkeetRecord,
    DebugLog,
    HandlerAgent
} from "../../../src";

describe('CreateSkeetHandler', () => {
    let createSkeetHandler: CreateSkeetHandler;
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
        createSkeetHandler = CreateSkeetHandler.make(
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
            const message: CreateSkeetMessage = CreateSkeetMessageFactory.make()
            await createSkeetHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalledWith(
                message,
                mockedHandlerAgent
            );
        });

        it('should run not actions when opType is d', async () => {
            const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().isDeletion().create()
            await createSkeetHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should not run validators when handle throws error', async () => {
            const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().seq(3).create()
            await createSkeetHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
