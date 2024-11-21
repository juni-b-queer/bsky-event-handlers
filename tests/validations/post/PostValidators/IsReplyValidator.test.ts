import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
    IsReplyValidator,
} from '../../../../src';
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

    test('shouldTrigger returns true if op.payload.reply is not null', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .withReply()
            .create();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if op.payload.reply is null', async () => {
        const message: CreateSkeetMessage =
            CreateSkeetMessageFactory.factory().create();
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
