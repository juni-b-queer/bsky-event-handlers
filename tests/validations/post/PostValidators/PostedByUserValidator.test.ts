import {
    HandlerAgent,
    JetstreamCollectionType,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    PostedByUserValidator,
} from '../../../../src';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/post/postedBy';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Posted by user validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const userDid = 'did:plc:user';
    const validator = PostedByUserValidator.make(userDid);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const createMessage = (
        did: string,
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
        const message = createMessage(userDid);
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false not posted by same user', async () => {
        const message = createMessage('did:plc:other');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if not a post', async () => {
        const message = createMessage(userDid, 'app.bsky.feed.like');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
