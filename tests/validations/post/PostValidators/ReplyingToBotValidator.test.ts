import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    ReplyFactory,
    ReplyingToBotValidator,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';

describe('ReplyingToBotValidator', () => {
    const validator = ReplyingToBotValidator.make();
    const botDid = 'did:plc:bot';

    it('shouldTrigger returns false if no reply', async () => {
        const message: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory().create();

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

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if the did is the same as the agent', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withReply(ReplyFactory.factory().replyTo(botDid).create())
            .create();

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

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if the did in the reply.parent.uri is not the same as the agent details', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withReply(ReplyFactory.factory().replyTo('did:plc:bad').create())
            .create();
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

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
