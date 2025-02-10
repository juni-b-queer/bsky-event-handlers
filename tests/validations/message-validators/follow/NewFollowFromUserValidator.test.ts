import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    JetstreamRecordFactory,
    NewFollowFromUserValidator,
    UserFollowedValidator,
} from '../../../../src';
import { BskyAgent } from '@atproto/api';
import dotenv from 'dotenv';
import fs from 'fs';

const sessPath = './tests/temp/val/follow/NewFollow';
dotenv.config();
process.env.SESSION_DATA_PATH = sessPath;

describe('New Follow From User Validator', () => {
    afterAll(() => {
        fs.rmSync(sessPath, {
            recursive: true,
            force: true,
        });
    });
    fs.mkdirSync(sessPath, { recursive: true });
    const botDid = 'did:plc:bot';
    const testDid = 'did:plc:test';
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
        const validator = NewFollowFromUserValidator.make();
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(botDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns true if given did is same as message did', async () => {
        const validator = NewFollowFromUserValidator.make(testDid);
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(testDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if given did is different from message did', async () => {
        const validator = NewFollowFromUserValidator.make('did:plc:test');
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(botDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if default bot did not follow did', async () => {
        const validator = NewFollowFromUserValidator.make();
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(testDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if using deprecated UserFollowedValidator', async () => {
        const validator = UserFollowedValidator.make();
        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(botDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if using deprecated UserFollowedValidator and given did differs', async () => {
        const validator = UserFollowedValidator.make(testDid);

        const message: JetstreamEventCommit = JetstreamEventFactory.factory()
            .fromDid(botDid)
            .commit(
                JetstreamCommitFactory.factory()
                    .record(
                        JetstreamRecordFactory.factory().isFollow().create()
                    )
                    .create()
            )
            .create() as JetstreamEventCommit;

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });
});
