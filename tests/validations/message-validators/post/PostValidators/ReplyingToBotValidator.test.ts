import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
    ReplyingToBotValidator,
} from '../../../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/post/replyToBot';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('ReplyingToBotValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const validator = ReplyingToBotValidator.make();
    const botDid = 'did:plc:bot';

    const createHandlerAgent = (): HandlerAgent => {
        const bskyAgent: BskyAgent = {
            session: {
                did: botDid,
            },
        } as BskyAgent;

        return new HandlerAgent('name', 'handle', 'password', bskyAgent);
    };

    const createMessage = (replyDid: string | undefined | null = null) => {
        const recordFactory = NewSkeetRecordFactory.factory();
        if (replyDid == 'default') {
            recordFactory.reply();
        } else if (replyDid) {
            recordFactory.reply(
                ReplyFactory.factory().replyTo(replyDid).create()
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

    it('shouldTrigger returns false if no reply', async () => {
        const message = createMessage();
        const handlerAgent = createHandlerAgent();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if the did is the same as the agent', async () => {
        const message = createMessage(botDid);
        const handlerAgent = createHandlerAgent();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if the did in the reply.parent.uri is not the same as the agent details', async () => {
        const message = createMessage('default');
        const handlerAgent = createHandlerAgent();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
