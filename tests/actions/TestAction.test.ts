import {
    HandlerAgent,
    JetstreamMessage, JetstreamMessageFactory,
    LogMessageAction,
    TestAction
} from "../../src";
import mocked = jest.mocked;
import { advanceTo } from 'jest-date-mock';

describe('TestAction', () => {
    let action: TestAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamMessage;
    console.log = jest.fn();

    beforeEach(() => {
        handlerAgent = {} as HandlerAgent;
        message = JetstreamMessageFactory.factory().create();
        action = new TestAction();
        advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log Working', async () => {
        await action.handle(message, handlerAgent);
        expect(console.log).toHaveBeenCalledWith(
            '1/31/2023, 07:00 PM | Working | INFO | working'
        );
    });

    it('Should Throw Error when running make', () => {
        expect(TestAction.make).toThrow(
            'Method not implemented! Use constructor!'
        );
    });
});
