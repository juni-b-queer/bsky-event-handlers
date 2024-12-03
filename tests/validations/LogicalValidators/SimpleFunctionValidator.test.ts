import {
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamEventFactory,
    SimpleFunctionValidator,
} from '../../../src';

describe('FunctionAction', () => {
    const mockHandlerAgent = {} as HandlerAgent;

    const mockMessage: JetstreamEventCommit =
        JetstreamEventFactory.factory().create() as JetstreamEventCommit;

    let mockvalidatorFunction = jest.fn();
    let functionValidator: SimpleFunctionValidator;

    beforeEach(() => {
        jest.clearAllMocks(); // clearing mocks
    });

    describe('Simple Function validator', () => {
        it('runs provided function with proper arguments', async () => {
            mockvalidatorFunction = jest.fn();
            functionValidator = SimpleFunctionValidator.make(
                mockvalidatorFunction
            );
            await functionValidator.shouldTrigger(
                mockHandlerAgent,
                mockMessage
            );
            expect(mockvalidatorFunction).toHaveBeenCalledWith(
                mockHandlerAgent,
                mockMessage
            );
        });
    });
});
