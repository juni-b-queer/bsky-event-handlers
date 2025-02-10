import {
    HandlerAgent,
    JetstreamEventCommit,
    JetstreamCommitFactory,
    JetstreamEventFactory,
    JetstreamRecordFactory,
    RepostByUser,
} from '../../../../src';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/repost/RepostByUser';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Repost By User Validator', () => {
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

    it('handle returns true if userDid is undefined and message did matches handlerAgent did', async () => {
        const validator = RepostByUser.make(undefined, 'example:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('handle returns true if provided userDid matches message did', async () => {
        const validator = RepostByUser.make('did:plc:bot', 'example:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(true);
    });

    it('handle returns false if message commit record subject is a string', async () => {
        const message = createMessage('', '');
        // @ts-ignore
        message.commit.record.subject = 'string' as unknown as string;

        const validator = RepostByUser.make();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('handle returns false if message commit record subject is undefined', async () => {
        const message = createMessage('', '');
        // @ts-ignore
        message.commit.record.subject = undefined;

        const validator = RepostByUser.make();

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('handle returns false if postUri does not match', async () => {
        const validator = RepostByUser.make('did:plc:bot', 'different:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });

    it('handle returns false if userDid is provided and does not match message did', async () => {
        const validator = RepostByUser.make('did:plc:other', 'example:uri');
        const message = createMessage('example:uri', 'did:plc:bot');

        expect(await validator.handle(mockHandlerAgent, message)).toBe(false);
    });
});
