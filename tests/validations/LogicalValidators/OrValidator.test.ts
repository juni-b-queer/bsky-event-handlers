import {
    HandlerAgent,
    InputEqualsValidator,
    InputStartsWithValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
    OrValidator,
} from '../../../src';

describe('OrValidator', () => {
    const key = 'test';
    const startsWithKeyValidator = InputStartsWithValidator.make('test');
    const equalsKeyValidator = InputEqualsValidator.make('test');
    const orValidator = OrValidator.make([
        startsWithKeyValidator,
        equalsKeyValidator,
    ]);
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const createMessage = (text: string) => {
        return JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(NewSkeetRecordFactory.factory().text(text).create())
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    test('shouldTrigger returns true if both validators pass', async () => {
        const message = createMessage('test');
        expect(await orValidator.shouldTrigger(handlerAgent, message)).toBe(
            true
        );
    });

    test('shouldTrigger returns true if one validator passes', async () => {
        const message = createMessage('test message');
        expect(await orValidator.shouldTrigger(handlerAgent, message)).toBe(
            true
        );
    });

    test('shouldTrigger returns false if no validators pass', async () => {
        const message = createMessage('random');
        expect(await orValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
