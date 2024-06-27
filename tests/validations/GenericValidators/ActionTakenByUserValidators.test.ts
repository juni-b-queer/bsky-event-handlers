import {
    ActionTakenByUserValidator,
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    JetstreamMessage,
    JetstreamMessageFactory,
} from '../../../src';

describe('Action Taken By User', () => {
    const validDid = 'did:plc:valid';
    const validator = ActionTakenByUserValidator.make(validDid);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    it('shouldTrigger returns true if posted by same did', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid(validDid)
            .create();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false not posted by same user', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.make();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if not a post, and posted by user', async () => {
        const message: JetstreamMessage = JetstreamMessageFactory.factory()
            .fromDid(validDid)
            .collection('app.bsky.feed.like')
            .create();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });
});
