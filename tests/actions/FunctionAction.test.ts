import {
    DebugLog,
    FunctionAction,
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamMessage,
    JetstreamMessageFactory,
    nowDateTime,
} from '../../src';
import mocked = jest.mocked;

describe('FunctionAction', () => {
    const mockHandlerAgent = {} as HandlerAgent;

    const mockMessage: JetstreamEventCommit = JetstreamEventFactory.factory()
        .commit()
        .create() as JetstreamEventCommit;

    let mockActionFunction = jest.fn();
    let functionAction: FunctionAction;

    beforeEach(() => {
        mockActionFunction = jest.fn();
        jest.clearAllMocks(); // clearing mocks
        functionAction = FunctionAction.make(mockActionFunction);
    });

    describe('handle', () => {
        it('runs provided function with proper arguments', async () => {
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(mockActionFunction).toHaveBeenCalledWith(
                mockHandlerAgent,
                mockMessage
            );
        });
    });
});

describe('FunctionAction With DebugLog', () => {
    jest.mock('console', () => ({
        log: jest.fn(),
    }));
    const mockHandlerAgent = {} as HandlerAgent;

    const mockMessage: JetstreamEventCommit = JetstreamEventFactory.factory()
        .commit()
        .create() as JetstreamEventCommit;

    beforeEach(() => {
        jest.clearAllMocks(); // clearing mocks
        jest.mock('console', () => ({
            log: jest.fn(),
        }));
    });

    describe('handle', () => {
        it('runs log with info default', async () => {
            mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
            mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'debug';
            const consoleSpy = jest.spyOn(console, 'log');
            const functionAction = new FunctionAction(
                (
                    handlerAgent: HandlerAgent | undefined,
                    message: JetstreamMessage
                ) => {
                    DebugLog.log('TEST', 'log');
                }
            );
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith(
                `${nowDateTime()} | TEST | DEBUG | log`
            );
        });

        it('runs with DebugLog.debug ', async () => {
            mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
            mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'debug';
            const consoleSpy = jest.spyOn(console, 'log');
            const functionAction = new FunctionAction(
                (
                    handlerAgent: HandlerAgent | undefined,
                    message: JetstreamMessage
                ) => {
                    DebugLog.debug('TEST', 'log');
                }
            );
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith(
                `${nowDateTime()} | TEST | DEBUG | log`
            );
        });

        it('runs with DebugLog.info', async () => {
            mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
            mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
            const consoleSpy = jest.spyOn(console, 'log');
            const functionAction = new FunctionAction(
                (
                    handlerAgent: HandlerAgent | undefined,
                    message: JetstreamMessage
                ) => {
                    DebugLog.info('TEST', 'log');
                }
            );
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith(
                `${nowDateTime()} | TEST | INFO | log`
            );
        });

        it('runs with DebugLog.warn', async () => {
            mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
            mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
            const consoleSpy = jest.spyOn(console, 'log');
            const functionAction = new FunctionAction(
                (
                    handlerAgent: HandlerAgent | undefined,
                    message: JetstreamMessage
                ) => {
                    DebugLog.warn('TEST', 'log');
                }
            );
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith(
                `${nowDateTime()} | TEST | WARN | log`
            );
        });

        it('runs with DebugLog.error', async () => {
            mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
            mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
            const consoleSpy = jest.spyOn(console, 'log');
            const functionAction = new FunctionAction(
                (
                    handlerAgent: HandlerAgent | undefined,
                    message: JetstreamMessage
                ) => {
                    DebugLog.error('TEST', 'log');
                }
            );
            await functionAction.handle(mockHandlerAgent, mockMessage);

            expect(consoleSpy).toHaveBeenCalledWith(
                `${nowDateTime()} | TEST | ERROR | log`
            );
        });
    });
});
