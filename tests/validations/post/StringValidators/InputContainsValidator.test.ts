import {
    HandlerAgent,
    InputContainsValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecordFactory,
} from '../../../../src';

describe('InputContainsValidator no strict parameter', () => {
    const validator = InputContainsValidator.make('test');
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

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
        const message = createMessage('test message');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message = createMessage('blahblahtestblahblah');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message = createMessage('message example');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});

describe('InputContainsValidator true strict parameter', () => {
    const validator = InputContainsValidator.make('test', true);
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

    test('shouldTrigger returns true if input contains with trigger keyword', async () => {
        const message = createMessage('test message');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns true if input contains trigger keyword in other words', async () => {
        const message = createMessage('blahblahtestblahblah');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(true);
    });

    test('shouldTrigger returns false if input does not contain trigger keyword', async () => {
        const message = createMessage('message example');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });

    test('shouldTrigger returns false if input does not match case sensitivity', async () => {
        const message = createMessage('Test');
        expect(await validator.shouldTrigger(handlerAgent, message)).toBe(
            false
        );
    });
});
