import {
    AbstractMessageAction,
    AbstractValidator,
    CreateSkeetHandler,
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    CreateSkeetRecord,
    DebugLog,
    FunctionAction,
    HandlerAgent,
    SimpleFunctionValidator,
} from '../../../src';

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
                (agent: HandlerAgent, message: CreateSkeetMessage) => {
                    return message.opType === 'c';
                }
            );
        mockActionHandle = jest
            .fn()
            .mockImplementation(
                (agent: HandlerAgent, message: CreateSkeetMessage) => {
                    if (message.seq === 3) {
                        throw new Error('error');
                    }
                    return;
                }
            );
        mockedHandlerAgent = {} as HandlerAgent;
        mockedValidators = [
            SimpleFunctionValidator.make(mockValidatorShouldTrigger),
        ];
        mockedActions = [FunctionAction.make(mockActionHandle)];
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
            const message: CreateSkeetMessage =
                CreateSkeetMessageFactory.make();
            await createSkeetHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalledWith(
                mockedHandlerAgent,
                message
            );
        });

        it('should run not actions when opType is d', async () => {
            const message: CreateSkeetMessage =
                CreateSkeetMessageFactory.factory().isDeletion().create();
            await createSkeetHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should not run validators when handle throws error', async () => {
            const message: CreateSkeetMessage =
                CreateSkeetMessageFactory.factory().seq(3).create();
            console.log(message);
            await createSkeetHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
