import { CreateSkeetMessage, CreateSkeetMessageFactory, HandlerAgent, IsReplyValidator } from "../../../../src";
import { BskyAgent } from "@atproto/api";

describe('IsReplyValidator', () => {
    const validator = IsReplyValidator.make();
    const botDid = "did:plc:bot";
    const bskyAgent: BskyAgent = {
        session: {
            did: botDid,
        },
    } as BskyAgent;
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    test('shouldTrigger returns true if op.payload.reply is not null', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().withReply().create()

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    test('shouldTrigger returns false if op.payload.reply is null', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory().create()
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
