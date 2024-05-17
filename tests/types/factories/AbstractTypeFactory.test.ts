import { TestFactory } from '../../../src';

describe('Abstract class throws errors', () => {
    it('factory throws error', () => {
        expect(TestFactory.factory).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });

    it('create throws error', () => {
        const factory = new TestFactory();
        expect(factory.create).toThrow(
            'Method Not Implemented! Use constructor.'
        );
    });
});
