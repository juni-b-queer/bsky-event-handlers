import {
    AbstractMessageAction,
    AbstractValidator,
    DebugLog,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
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
                (agent: HandlerAgent, message: JetstreamEventCommit) => {
                    return message.commit.operation === 'create';
                }
            );
        mockActionHandle = jest
            .fn()
            .mockImplementation(
                (agent: HandlerAgent, message: JetstreamEventCommit) => {
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
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .commit()
                    .create() as JetstreamEventCommit;
            await messageHandler.handle(undefined, message);

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

            await messageHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should debug log error when handle throws error', async () => {
            const message: JetstreamEventCommit =
                JetstreamEventFactory.factory()
                    .fromDid('err')
                    .commit()
                    .create() as JetstreamEventCommit;

            await messageHandler.handle(undefined, message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
