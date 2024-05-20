import {
    AbstractMessageAction,
    AbstractValidator,
    CreateSkeetMessage,
    DebugLog,
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
    TestHandler,
} from '../../src';

describe('TestHandler', () => {
    let testHandler: TestHandler;
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
        it('should run actions when opType is c', async () => {
            //make CreateSkeetMessage
            const message: JetstreamMessage = JetstreamMessageFactory.make();
            await testHandler.handle(message);

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
            await testHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).not.toHaveBeenCalled();
        });

        it('should debug log error when handle throws error', async () => {
            const message: JetstreamMessage = {
                collection: '',
                did: '',
                opType: 'c',
                rkey: '',
                seq: 3,
                cid: 'cid',
            };
            await testHandler.handle(message);

            expect(mockValidatorShouldTrigger).toHaveBeenCalled();
            expect(mockActionHandle).toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalled();
        });
    });
});
