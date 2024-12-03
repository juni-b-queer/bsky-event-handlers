import {
    DebugLogAction,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamMessage,
    JetstreamMessageFactory,
    LogInputTextAction,
} from '../../src';
import { advanceTo } from 'jest-date-mock';
import mocked = jest.mocked;

describe('LogInputTextAction', () => {
    let input: string;
    let action: LogInputTextAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    console.log = jest.fn();

    beforeEach(() => {
        input = 'hello';
        handlerAgent = {} as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = LogInputTextAction.make(input);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log output of RepoOp object when handle() is called', async () => {
        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(input);
    });
});

describe('LogInputTextAction', () => {
    let action: DebugLogAction;
    const handlerAgent: HandlerAgent = {} as HandlerAgent;
    const message: JetstreamEventCommit = JetstreamEventFactory.factory()
        .commit()
        .create() as JetstreamEventCommit;
    console.log = jest.fn();

    beforeEach(() => {
        advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log info when no level given', async () => {
        const expected = '1/31/2023, 07:00 PM | TEST | INFO | Hello';

        action = DebugLogAction.make('TEST', 'Hello');

        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('Should log info when no level given without make', async () => {
        const expected = '1/31/2023, 07:00 PM | TEST | INFO | Hello';

        action = new DebugLogAction('TEST', 'Hello');

        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('Should log info', async () => {
        const expected = '1/31/2023, 07:00 PM | TEST | INFO | Hello';

        action = DebugLogAction.make('TEST', 'Hello', 'info');

        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('Should log warn', async () => {
        const expected = '1/31/2023, 07:00 PM | TEST | WARN | Hello';

        action = DebugLogAction.make('TEST', 'Hello', 'warn');

        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('Should log error', async () => {
        const expected = '1/31/2023, 07:00 PM | TEST | ERROR | Hello';

        action = DebugLogAction.make('TEST', 'Hello', 'error');

        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(expected);
    });
});
