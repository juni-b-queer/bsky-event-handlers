import {
    CreateSkeetMessage,
    HandlerAgent,
    InputEqualsValidator,
    InputStartsWithValidator,
    OrValidator,
    Subject,
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

    test('shouldTrigger returns true if both validators pass', async () => {
        const message: CreateSkeetMessage = {
            collection: '',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'test',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            true
        );
    });

    test('shouldTrigger returns true if one validator passes', async () => {
        const message: CreateSkeetMessage = {
            collection: '',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'test message',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            true
        );
    });

    test('shouldTrigger returns false if no validators pass', async () => {
        const message: CreateSkeetMessage = {
            collection: '',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'random',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };

        expect(await orValidator.shouldTrigger(message, handlerAgent)).toBe(
            false
        );
    });
});
