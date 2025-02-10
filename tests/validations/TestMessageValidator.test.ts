import {
    HandlerAgent,
    JetstreamCommitFactory,
    JetstreamEventCommit,
    JetstreamEventFactory,
} from '../../src';
import { TestMessageValidator } from '../../src/validations/message-validators/TestMessageValidator';

const mockAgent: HandlerAgent = {} as HandlerAgent;
describe('TestMessageValidator', () => {
    test('shouldTrigger returns true for true attribute', async () => {
        const validator = TestMessageValidator.make(true);
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.feed.post')
                    .create()
            )
            .create() as JetstreamEventCommit;
        expect(await validator.shouldTrigger(mockAgent, msg)).toBe(true);
    });

    test('shouldTrigger returns false for false attribute', async () => {
        const validator = TestMessageValidator.make(false);
        const msg: JetstreamEventCommit = JetstreamEventFactory.factory()
            .commit(
                JetstreamCommitFactory.factory()
                    .operation('delete')
                    .collection('app.bsky.feed.post')
                    .create()
            )
            .create() as JetstreamEventCommit;
        expect(await validator.shouldTrigger(mockAgent, msg)).toBe(false);
    });
});
