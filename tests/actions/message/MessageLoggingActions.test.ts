import {
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamEventFactory,
    LogMessageAction,
} from '../../../src';

describe('LogMessageAction', () => {
    let action: LogMessageAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    console.log = jest.fn();

    beforeEach(() => {
        handlerAgent = {} as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = LogMessageAction.make();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should log output of RepoOp object when handle() is called', async () => {
        await action.handle(handlerAgent, message);
        expect(console.log).toHaveBeenCalledWith(message);
    });
});
