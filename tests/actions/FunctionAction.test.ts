import {FunctionAction, HandlerAgent, JetstreamMessage} from "../../src";

describe("FunctionAction", () => {
    const mockHandlerAgent = {} as HandlerAgent;

    const mockMessage: JetstreamMessage = {
        collection: "", did: "", opType: "", rkey: "", seq: 0,
    }

    let mockActionFunction = jest.fn();
    let functionAction: FunctionAction;

    beforeEach(() => {
        mockActionFunction = jest.fn();
        jest.clearAllMocks(); // clearing mocks
        functionAction = new FunctionAction(mockActionFunction);
    });

    describe("handle", () => {
        it("runs provided function with proper arguments", async () => {
            await functionAction.handle(
                mockHandlerAgent,
                mockMessage
            );

            expect(mockActionFunction).toHaveBeenCalledWith(
                mockHandlerAgent,
                mockMessage
            );
        });
    });
});
