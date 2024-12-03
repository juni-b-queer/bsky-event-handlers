import {
    CreateSkeetMessageAction,
    CreateSkeetWithGeneratedTextAction,
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamEventFactory,
} from '../../../../src';

describe('Create Skeet Action', () => {
    let action: CreateSkeetMessageAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    const mockCreateSkeet = jest.fn();
    const skeetText: string = 'Test Text';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
        } as unknown as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = CreateSkeetMessageAction.make(skeetText);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        await action.handle(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith(skeetText, undefined);
    });
});

describe('Create Skeet from generated text Action', () => {
    let action: CreateSkeetWithGeneratedTextAction;
    let handlerAgent: HandlerAgent;
    let message: JetstreamEventCommit;
    const mockGenerateText = jest.fn().mockReturnValue('hello');
    const mockCreateSkeet = jest.fn();
    const skeetText: string = 'Test Text';

    beforeEach(() => {
        handlerAgent = {
            createSkeet: mockCreateSkeet,
        } as unknown as HandlerAgent;
        message = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;
        action = CreateSkeetWithGeneratedTextAction.make(mockGenerateText);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call CreateSkeet with text', async () => {
        await action.handle(handlerAgent, message);
        expect(mockGenerateText).toHaveBeenCalledWith(handlerAgent, message);
        expect(mockCreateSkeet).toHaveBeenCalledWith('hello');
    });
});
