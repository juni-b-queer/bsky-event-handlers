import {
    flattenTextUpdated,
    getJetstreamSubjectOrFunctionReturn,
    getStringArrayOrFunctionReturn,
    getStringOrFunctionReturn,
    HandlerAgent,
    JetstreamSubject,
} from '../../src';
import { mockDeep } from 'jest-mock-extended';

describe('getStringOrFunctionReturn', () => {
    const mockHandlerAgent = mockDeep<HandlerAgent>();
    test('getStringOrFunctionReturn with String', () => {
        const input = 'well actually';
        const expected = 'well actually';
        expect(getStringOrFunctionReturn(input, mockHandlerAgent)).toBe(
            expected
        );
    });
    test('getStringOrFunctionReturn with function', () => {
        const expected = 'example';

        const input = (handlerAgent: HandlerAgent, ...args: any) => {
            return expected;
        };
        expect(getStringOrFunctionReturn(input, mockHandlerAgent)).toBe(
            expected
        );
    });
});

describe('getStringArrayOrFunctionReturn', () => {
    const mockHandlerAgent = mockDeep<HandlerAgent>();

    test('getStringArrayOrFunctionReturn with string array', () => {
        const input = ['hello', 'world'];
        const expected = ['hello', 'world'];

        expect(getStringArrayOrFunctionReturn(input, mockHandlerAgent)).toEqual(
            expected
        );
    });

    test('getStringArrayOrFunctionReturn with function', () => {
        const expected = ['function', 'generated', 'array'];

        const input = (handlerAgent: HandlerAgent, ...args: any): string[] => {
            return expected;
        };

        expect(getStringArrayOrFunctionReturn(input, mockHandlerAgent)).toEqual(
            expected
        );
    });
});

describe('getJetstreamSubjectOrFunctionReturn', () => {
    const mockHandlerAgent = mockDeep<HandlerAgent>();

    test('getJetstreamSubjectOrFunctionReturn with JetstreamSubject', () => {
        const input: JetstreamSubject = {
            cid: 'test-cid',
            uri: 'test-uri',
        };
        const expected: JetstreamSubject = {
            cid: 'test-cid',
            uri: 'test-uri',
        };

        expect(
            getJetstreamSubjectOrFunctionReturn(input, mockHandlerAgent)
        ).toEqual(expected);
    });

    test('getJetstreamSubjectOrFunctionReturn with function', () => {
        const expected: JetstreamSubject = {
            cid: 'function-cid',
            uri: 'function-uri',
        };

        const input = (
            handlerAgent: HandlerAgent,
            ...args: any
        ): JetstreamSubject => {
            return expected;
        };

        expect(
            getJetstreamSubjectOrFunctionReturn(input, mockHandlerAgent)
        ).toEqual(expected);
    });
});
