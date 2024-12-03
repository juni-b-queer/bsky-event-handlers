import {
    HandlerAgent,
    IsNewPost,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecord,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/post/isNewPost';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('IsNewPost', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const validator = IsNewPost.make();
    const botDid = 'did:plc:bot';
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

    test('handle returns false with no record ', async () => {
        const recentDate = new Date();
        recentDate.setHours(recentDate.getHours() - 1);

        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit()
            .create() as JetstreamEventCommit;

        expect(await validator.handle(handlerAgent, message)).toBe(false);
    });

    test('handle returns true if message is created within the last 24 hours', async () => {
        const recentDate = new Date();
        recentDate.setHours(recentDate.getHours() - 1);

        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .record({
                        createdAt: recentDate.toISOString(),
                    } as NewSkeetRecord)
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.handle(handlerAgent, message)).toBe(true);
    });

    test('handle returns false if message is created more than 24 hours ago', async () => {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 2);
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .record({
                        createdAt: oldDate.toISOString(),
                    } as NewSkeetRecord)
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.handle(handlerAgent, message)).toBe(false);
    });
});
