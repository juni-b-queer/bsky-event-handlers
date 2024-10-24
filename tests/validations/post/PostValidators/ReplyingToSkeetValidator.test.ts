import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    ReplyFactory,
    ReplyingToSkeetValidator,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';

describe('ReplyingToSkeetValidator', () => {
    const skeetUri = 'at://some.skeet/uri';
    const validator = ReplyingToSkeetValidator.make(skeetUri);
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

        jest.spyOn(handlerAgent, 'hasPostReply').mockReturnValue(false);

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if the reply parent URI matches skeetUri', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withReply(ReplyFactory.factory().replyTo(botDid).create())
            .create();

        message.record.reply!.parent.uri = skeetUri;

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

        jest.spyOn(handlerAgent, 'hasPostReply').mockReturnValue(true);

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if the reply parent URI does not match skeetUri', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withReply(ReplyFactory.factory().replyTo(botDid).create())
            .create();

        message.record.reply!.parent.uri = 'at://another.skeet/uri';

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

        jest.spyOn(handlerAgent, 'hasPostReply').mockReturnValue(true);

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
