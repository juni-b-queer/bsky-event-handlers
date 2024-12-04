import {
    JetstreamEventCommit,
    JetstreamCommitFactory,
    JetstreamEventFactory,
    JetstreamRecordFactory,
    RepostOfPost,
    HandlerAgent,
} from '../../../../src';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/repost/RepostOfPost';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Repost Of Post Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });

    const mockHandlerAgent: HandlerAgent = {
        getDid: 'did:plc:bot',
        getDIDFromUri: jest.fn().mockReturnValue('did:plc:bot'),
    } as unknown as HandlerAgent;

    const createMessage = (subjectUri: string, did: string) => {
        return JetstreamEventFactory.factory()
            .fromDid(did)
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.repost')
                    .record(
                        JetstreamRecordFactory.factory()
                            .subject({ uri: subjectUri, cid: 'test' })
                            .create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    it('handle returns true if postUri matches the message subject uri', async () => {
        const validator = RepostOfPost.make('example:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('handle returns false if message commit record subject is a string', async () => {
        const message = createMessage('', '');
        // @ts-ignore
        message.commit.record.subject = '' as unknown as { uri: string };

        const validator = RepostOfPost.make('example:uri');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('handle returns false if message commit record subject is undefined', async () => {
        const message = createMessage('', '');
        // @ts-ignore
        message.commit.record.subject = undefined;

        const validator = RepostOfPost.make('example:uri');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('handle returns false if postUri does not match the message subject uri', async () => {
        const validator = RepostOfPost.make('different:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });
});
