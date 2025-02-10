import {
    ActionTakenByUserValidator,
    HandlerAgent,
    JetstreamCollectionType,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../src';

describe('Action Taken By User', () => {
    const validDid = 'did:plc:valid';
    const validator = ActionTakenByUserValidator.make(validDid);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const createMessage = (
        did: string = 'did::plc:default',
        collection: JetstreamCollectionType = 'app.bsky.feed.post'
    ) => {
        return JetstreamEventFactory.factory()
            .fromDid(did)
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection(collection)
                    .record(NewSkeetRecordFactory.factory().create())
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    it('shouldTrigger returns true if posted by same did', async () => {
        const message = createMessage(validDid);
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false not posted by same user', async () => {
        const message = createMessage(); // Assuming this line can remain as is for a basic test message without a specific did
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if not a post, and posted by user', async () => {
        const message = createMessage(validDid, 'app.bsky.feed.like');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });
});
