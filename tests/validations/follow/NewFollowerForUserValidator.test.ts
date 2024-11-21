import {
    CreateMessage,
    CreateMessageFactory,
    HandlerAgent,
    NewFollowerForUserValidator,
    RecordFactory,
} from '../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/follow/NewFollower';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('New Follower For User Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const botDid = 'did:plc:bot';
    const bskyAgent: BskyAgent = {
        session: {
            did: botDid,
        },
    } as BskyAgent;
    const mockHandlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        bskyAgent
    );

    it('shouldTrigger returns true if no did provided, and follow is by bot user', async () => {
        const validator = NewFollowerForUserValidator.make();
        const message: CreateMessage = CreateMessageFactory.factory()
            .record(RecordFactory.factory().isFollow(botDid).create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns true if given did is same as message did', async () => {
        const testDid = 'did:plc:test';
        const validator = NewFollowerForUserValidator.make(testDid);
        const message: CreateMessage = CreateMessageFactory.factory()
            .record(RecordFactory.factory().isFollow(testDid).create())
            .create();
        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if given did is different from message did', async () => {
        const testDid = 'did:plc:test';
        const validator = NewFollowerForUserValidator.make(testDid);
        const message: CreateMessage = CreateMessageFactory.factory()
            .record(RecordFactory.factory().isFollow('did:plc:other').create())
            .create();
        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if default bot did not get followed', async () => {
        const testDid = 'did:plc:test';
        const validator = NewFollowerForUserValidator.make();
        const message: CreateMessage = CreateMessageFactory.factory()
            .record(RecordFactory.factory().isFollow(testDid).create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });
});
