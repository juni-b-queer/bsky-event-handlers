import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    PostedByUserValidator,
} from '../../../../src';

describe('Posted by user validator', () => {
    const userDid = 'did:plc:user';
    const validator = PostedByUserValidator.make(userDid);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    it('shouldTrigger returns true if posted by same did', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid(userDid)
            .create();
        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(true);
    });

    it('shouldTrigger returns false not posted by same user', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid('did:plc:other')
            .create();

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if not a post', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .collection('app.bsky.feed.like')
            .create();

        expect(await validator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
