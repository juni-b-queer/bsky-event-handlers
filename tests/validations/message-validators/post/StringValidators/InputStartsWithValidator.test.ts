import {
    HandlerAgent,
    InputStartsWithValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../../../src';

describe('InputStartsWithValidator', () => {
    const validator = InputStartsWithValidator.make('test');
    const strictValidator = InputStartsWithValidator.make('test', true);
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

    test('shouldTrigger returns true if input starts with trigger keyword', async () => {
        const message = createMessage('test message');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if input does not start with trigger keyword', async () => {
        const message = createMessage('message test');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger in strict mode returns true only if input strictly starts with trigger keyword', async () => {
        const message = createMessage('Test message');
        expect(await strictValidator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
