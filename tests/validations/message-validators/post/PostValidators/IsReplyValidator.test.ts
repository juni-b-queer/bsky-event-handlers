import {
    HandlerAgent,
    IsReplyValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
} from '../../../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/post/reply';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('IsReplyValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const validator = IsReplyValidator.make();
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

    const createMessage = (reply: boolean) => {
        const recordFactory =
            NewSkeetRecordFactory.factory().text('Check reply');

        if (reply) {
            recordFactory.reply(
                ReplyFactory.factory().replyTo(botDid).create()
            );
        }

        return JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(recordFactory.create())
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    test('shouldTrigger returns true if op.payload.reply is not null', async () => {
        const message = createMessage(true);
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if op.payload.reply is null', async () => {
        const message = createMessage(false);
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
