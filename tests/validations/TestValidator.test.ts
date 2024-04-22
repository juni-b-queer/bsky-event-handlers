import {CreateSkeetMessage, HandlerAgent, IsGoodBotValidator, Subject} from "../../src";
import {TestValidator} from "../../src";

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('IsGoodBotValidator', () => {


    test('shouldTrigger returns true for true attribute', async () => {
        const validator = new TestValidator(true);
        const positiveMessage: CreateSkeetMessage = {
            collection: "",
            did: "",
            opType: "c",
            rkey: "",
            seq: 0,
            record: {
                text: "great bot",
                $type: "",
                createdAt: "",
                subject: {} as Subject,
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(true);
    });

    test('shouldTrigger returns false for false attribute', async () => {
        const validator = new TestValidator(false);
        const positiveMessage: CreateSkeetMessage = {
            collection: "",
            did: "",
            opType: "c",
            rkey: "",
            seq: 0,
            record: {
                text: "great bot",
                $type: "",
                createdAt: "",
                subject: {} as Subject,
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(false);
    });

});