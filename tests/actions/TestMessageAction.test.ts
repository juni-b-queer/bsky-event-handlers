import {
    HandlerAgent,
    JetstreamEvent,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamMessage,
    JetstreamMessageFactory,
    TestMessageAction,
} from '../../src';
import { advanceTo } from 'jest-date-mock';
import mocked = jest.mocked;

describe('TestMessageAction', () => {
    let action: TestMessageAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    console.log = jest.fn();

    beforeEach(() => {
        handlerAgent = {} as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = new TestMessageAction();
        advanceTo(new Date(Date.UTC(2023, 1, 1, 1, 0, 0)));
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log Working', async () => {
        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(
            '1/31/2023, 07:00 PM | Working | INFO | working'
        );
    });

    it('Should Throw Error when running make', () => {
        expect(TestMessageAction.make).toThrow(
            'Method not implemented! Use constructor!'
        );
    });
});
