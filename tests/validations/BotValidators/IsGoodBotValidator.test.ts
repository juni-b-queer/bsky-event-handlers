import {CreateSkeetMessage, HandlerAgent, IsGoodBotValidator, Subject} from "../../../src";

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('IsGoodBotValidator', () => {
    const validator = new IsGoodBotValidator();

    test('shouldTrigger returns true for positive bot responses', async () => {
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

    test('shouldTrigger returns true for thank you', async () => {
        const positiveMessage: CreateSkeetMessage = {
            collection: "",
            did: "",
            opType: "c",
            rkey: "",
            seq: 0,
            record: {
                text: "ok thank you",
                $type: "",
                createdAt: "",
                subject: {} as Subject,
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(true);
    });

    test('shouldTrigger returns false for non-positive bot responses', async () => {
        const negativeMessage: CreateSkeetMessage = {
            collection: "",
            did: "",
            opType: "c",
            rkey: "",
            seq: 0,
            record: {
                text: "bad bot",
                $type: "",
                createdAt: "",
                subject: {} as Subject,
            },
        };

        expect(await validator.shouldTrigger(negativeMessage, mockAgent)).toBe(false);
    });
});