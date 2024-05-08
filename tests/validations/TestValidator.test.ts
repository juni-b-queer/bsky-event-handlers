import {
    CreateSkeetMessage,
    HandlerAgent,
    IsGoodBotValidator,
    Subject,
} from '../../src';
import { TestValidator } from '../../src';

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('TestValidator', () => {
    test('shouldTrigger returns true for true attribute', async () => {
        const validator = TestValidator.make(true);
        const positiveMessage: CreateSkeetMessage = {
            collection: '',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'great bot',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            true
        );
    });

    test('shouldTrigger returns false for false attribute', async () => {
        const validator = TestValidator.make(false);
        const positiveMessage: CreateSkeetMessage = {
            collection: '',
            did: '',
            opType: 'c',
            rkey: '',
            seq: 0,
            cid: 'cid',
            record: {
                text: 'great bot',
                $type: '',
                createdAt: '',
                subject: {} as Subject,
            },
        };
        expect(await validator.shouldTrigger(positiveMessage, mockAgent)).toBe(
            false
        );
    });
});
