import dotenv from 'dotenv';
import fs from 'fs';
import {
    CanDmUserValidator,
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../src';
import { mockDeep } from 'jest-mock-extended';
import { AtpAgent } from '@atproto/api';

const sessPath = './tests/temp/val/post/DmValidators';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('Can DM User Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const userDid = 'did:plc:user';
    const validator = CanDmUserValidator.make(userDid);
    const atpAgent = mockDeep<AtpAgent>();
    Object.defineProperty(atpAgent, 'session', {
        value: {
            did: 'did:plc:mockdid',
            handle: 'mockhandle.test',
            email: 'mock@example.com',
            emailConfirmed: true,
            accessJwt: 'mock-access-jwt',
            refreshJwt: 'mock-refresh-jwt',
        },
        writable: false,
    });
    const handlerAgent: HandlerAgent = new HandlerAgent(
        'name',
        'handle',
        'password',
        atpAgent
    );

    const message = JetstreamEventFactory.factory()
        .fromDid('did:plc:other')
        .commit(
            JetstreamCommitFactory.factory()
                .operation('create')
                .collection('app.bsky.feed.post')
                .record(NewSkeetRecordFactory.factory().create())
                .create()
        )
        .create() as JetstreamEventCommit;

    it('shouldTrigger returns true if CanDM returns true', async () => {
        // @ts-ignore
        atpAgent!.chat.bsky.convo.getConvoAvailability.mockResolvedValue({
            data: {
                canChat: true,
            },
            success: true,
        });

        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    it('shouldTrigger returns false if CanDM returns false', async () => {
        // @ts-ignore
        atpAgent!.chat.bsky.convo.getConvoAvailability.mockResolvedValue({
            data: {
                canChat: false,
            },
            success: true,
        });
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
