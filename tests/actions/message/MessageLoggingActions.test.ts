import {
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
    LogMessageAction,
} from '../../../src';

describe('LogMessageAction', () => {
    let action: LogMessageAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamMessage;
    console.log = jest.fn();

    beforeEach(() => {
        handlerAgent = {} as HandlerAgent;
        message = JetstreamMessageFactory.factory().create();
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
