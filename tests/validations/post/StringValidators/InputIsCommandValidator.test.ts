import {
    HandlerAgent,
    InputIsCommandValidator,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
    NewSkeetRecord,
    NewSkeetRecordFactory,
} from '../../../../src';

describe('InputIsCommandValidator Class', () => {
    let inputIsCommandValidator: InputIsCommandValidator;
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

    beforeEach(() => {
        inputIsCommandValidator = InputIsCommandValidator.make('key');
    });

    it('should test shouldTrigger function - Prefix case', async () => {
        let message = createMessage('!key someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('!key');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('someCommand !key');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message = createMessage('someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });

    it('should test shouldTrigger function - Suffix case', async () => {
        let message = createMessage('key! someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('key!');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('someCommand key!');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message = createMessage('someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });
});

describe('InputIsCommandValidator Not strict Class', () => {
    let inputIsCommandValidator: InputIsCommandValidator;
    const handlerAgent: HandlerAgent = {} as HandlerAgent;

    const createMessage = (text: string | undefined = undefined) => {
        let record: NewSkeetRecord;
        if (text == undefined) {
            record = NewSkeetRecordFactory.make();
        } else {
            record = NewSkeetRecordFactory.factory().text(text).create();
        }

        return JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('create')
                    .collection('app.bsky.feed.post')
                    .record(record)
                    .create()
            )
            .create() as JetstreamEventCommit;
    };

    beforeEach(() => {
        inputIsCommandValidator = InputIsCommandValidator.make('key', false);
    });

    it('should test shouldTrigger function - Prefix case', async () => {
        let message = createMessage('!Key someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('!keY');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('someCommand !key');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message = createMessage();
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });

    it('should test shouldTrigger function - Suffix case', async () => {
        let message = createMessage('keY! someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('Key!');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(true);

        message = createMessage('someCommand key!');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);

        message = createMessage('someCommand');
        expect(
            await inputIsCommandValidator.shouldTrigger(handlerAgent, message)
        ).toBe(false);
    });
});
