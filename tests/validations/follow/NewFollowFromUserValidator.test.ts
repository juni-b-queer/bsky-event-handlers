import {
    CreateMessage,
    CreateMessageFactory,
    HandlerAgent,
    NewFollowFromUserValidator,
    RecordFactory,
    UserFollowedValidator,
} from '../../../src';
import { BskyAgent } from '@atproto/api';

describe('New Follow From User Validator', () => {
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
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(botDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns true if given did is same as message did', async () => {
        const validator = NewFollowFromUserValidator.make(testDid);
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(testDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if given did is different from message did', async () => {
        const validator = NewFollowFromUserValidator.make('did:plc:test');
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(botDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns false if default bot did not follow did', async () => {
        const validator = NewFollowFromUserValidator.make();
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(testDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });

    it('shouldTrigger returns true if using deprecated UserFollowedValidator', async () => {
        const validator = UserFollowedValidator.make();
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(botDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            true
        );
    });

    it('shouldTrigger returns false if using deprecated UserFollowedValidator and given did differs', async () => {
        const validator = UserFollowedValidator.make(testDid);
        const message: CreateMessage = CreateMessageFactory.factory()
            .fromDid(botDid)
            .record(RecordFactory.factory().isFollow().create())
            .create();

        expect(await validator.shouldTrigger(mockHandlerAgent, message)).toBe(
            false
        );
    });
});
