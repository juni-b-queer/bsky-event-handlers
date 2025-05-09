import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    ReplyFactory,
    ReplyingToSkeetValidator,
} from '../../../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/post/replyToBot';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('ReplyingToSkeetValidator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const skeetUri = 'at://did:plc:bot/app.bsky.feed.post/otherRkey';
    const validator = ReplyingToSkeetValidator.make(skeetUri);
    const botDid = 'did:plc:bot';

    const createHandlerAgent = (): HandlerAgent => {
        const bskyAgent: BskyAgent = {
            session: {
                did: botDid,
            },
        } as BskyAgent;

        return new HandlerAgent('name', 'handle', 'password', bskyAgent);
    };

    const createMessage = (replyUri: string | undefined | null = null) => {
        const recordFactory = NewSkeetRecordFactory.factory();
        if (replyUri == 'default') {
            recordFactory.reply();
        } else if (replyUri) {
            recordFactory.reply(
                ReplyFactory.factory().replyUri(replyUri).create()
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

    it('shouldTrigger returns true if the uri is the same as the skeetUri', async () => {
        const message = createMessage(skeetUri);
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
