import {
    AbstractAction,
    AbstractMessageAction,
    AbstractValidator,
    CreateSkeetMessage,
    DebugLog,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    TestHandler,
    TestMessageHandler,
} from '../../src';

describe('TestHandler', () => {
    let testHandler: TestHandler;
    let mockedHandlerAgent: HandlerAgent;
    let mockedValidators: AbstractValidator[];
    let mockedActions: AbstractAction[];
    let mockValidatorShouldTrigger: jest.Mock<any, any, any>;
    let mockActionHandle: jest.Mock<any, any, any>;
    let mockDebugError: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockDebugError = jest.fn();
        DebugLog.error = mockDebugError;
        mockValidatorShouldTrigger = jest
            .fn()
            .mockImplementation((agent: HandlerAgent, ...args: any) => {
                return args[0] === 1;
            });
        mockActionHandle = jest
            .fn()
            .mockImplementation((agent: HandlerAgent, ...args: any) => {
                if (args[1] === 1) {
                    throw new Error('error');
                }
                return;
            });
        mockedHandlerAgent = {} as HandlerAgent;
        mockedValidators = [
            {
                shouldTrigger: mockValidatorShouldTrigger,
            } as unknown as AbstractValidator,
        ];
        mockedActions = [
            {
                handle: mockActionHandle,
            } as unknown as AbstractAction,
        ];
        testHandler = new TestHandler(
            mockedValidators,
            mockedActions,
            mockedHandlerAgent
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should throw error when calling make', () => {
        expect(TestHandler.make).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });

    describe('handle', () => {
        it('should run actions when arg is 1', async () => {
            await testHandler.handle(undefined, 1);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalledWith(
                mockedHandlerAgent,
                1
            );
        });

        it('should run not actions when arg is 0', async () => {
            await testHandler.handle(undefined, 0);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should debug log error when handle throws error', async () => {
            await testHandler.handle(undefined, 1, 1);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});

describe('TestMessageHandler', () => {
    let testMessageHandler: TestMessageHandler;
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
                (agent: HandlerAgent, message: JetstreamEventCommit) => {
                    return message.commit.operation === 'create';
                }
            );
        mockActionHandle = jest
            .fn()
            .mockImplementation(
                (agent: HandlerAgent, message: CreateSkeetMessage) => {
                    if (message.did === 'err') {
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
        testMessageHandler = new TestMessageHandler(
            mockedValidators,
            mockedActions,
            mockedHandlerAgent
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // it('Should throw error when calling make', () => {
    //     expect(TestMessageHandler.make).toThrow(
    //         'Method Not Implemented! Use constructor.'
    //     );
    // });

    describe('handle', () => {
        it('should run actions when opType is c', async () => {
            //make CreateSkeetMessage
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .commit(
                        JetstreamCommitFactory.factory()
                            .operation('create')
                            .create()
                    )
                    .create() as JetstreamEventCommit;
            await testMessageHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalledWith(
                mockedHandlerAgent,
                message
            );
        });

        it('should run not actions when opType is d', async () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .commit(
                        JetstreamCommitFactory.factory()
                            .operation('delete')
                            .create()
                    )
                    .create() as JetstreamEventCommit;

            await testMessageHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should debug log error when handle throws error', async () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid('err')
                    .commit()
                    .create() as JetstreamEventCommit;
            await testMessageHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
