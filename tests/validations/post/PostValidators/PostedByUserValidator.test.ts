import {
    CreateSkeetMessage,
    CreateSkeetMessageFactory,
    HandlerAgent,
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

    it('shouldTrigger returns true if posted by same did', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid(userDid)
            .create();
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false not posted by same user', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .fromDid('did:plc:other')
            .create();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if not a post', async () => {
        const message: CreateSkeetMessage = CreateSkeetMessageFactory.factory()
            .collection('app.bsky.feed.like')
            .create();

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
