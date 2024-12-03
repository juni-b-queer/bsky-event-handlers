import {
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamEventFactory,
    TestAction,
} from '../../src';
import { advanceTo } from 'jest-date-mock';
import mocked = jest.mocked;

describe('TestAction', () => {
    let action: TestAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    console.log = jest.fn();

    beforeEach(() => {
        handlerAgent = {} as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = new TestAction();
        advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log Working', async () => {
        await action.handle(handlerAgent);
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
