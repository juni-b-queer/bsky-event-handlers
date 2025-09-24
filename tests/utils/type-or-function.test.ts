import {
    getJetstreamSubjectOrFunctionReturn,
    getStringArrayOrFunctionReturn,
    getStringOrFunctionReturn,
    getValueOrFunctionReturn,
    HandlerAgent,
    JetstreamSubject,
} from '../../src';
import { mockDeep } from 'jest-mock-extended';

describe('getValueOrFunctionReturn', () => {
    const mockHandlerAgent = mockDeep<HandlerAgent>();
    describe('String', () => {
        test('Get String from String', () => {
            const input: string = 'input string';
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                input
            );
        });
        test('Get String from function', () => {
            const generated: string = 'expected from function ';

            const input = (handlerAgent: HandlerAgent, ...args: any) => {
                return generated;
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                generated
            );
        });
    });

    describe('JetstreamSubject', () => {
        test('Get JetstreamSubject from JetstreamSubject', () => {
            const input: JetstreamSubject = {
                cid: 'cid',
                uri: 'uri',
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                input
            );
        });
        test('Get JetstreamSubject from function', () => {
            const generated: JetstreamSubject = {
                cid: 'cid',
                uri: 'uri',
            };
            const input = (handlerAgent: HandlerAgent, ...args: any) => {
                return generated;
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                generated
            );
        });
    });

    describe('String[]', () => {
        test('Get String[] from String[]', () => {
            const input: string[] = ['input', 'string'];
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                input
            );
        });
        test('Get String[] from function', () => {
            const generated: string[] = ['expected', 'from', 'function'];
            const input = (handlerAgent: HandlerAgent, ...args: any) => {
                return generated;
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                generated
            );
        });
    });
    describe('boolean', () => {
        test('Get boolean from boolean', () => {
            const input: boolean = true;
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                input
            );
        });
        test('Get boolean from function', () => {
            const generated: boolean = true;
            const input = (handlerAgent: HandlerAgent, ...args: any) => {
                return generated;
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                generated
            );
        });
    });

    describe('number', () => {
        test('Get number from number', () => {
            const input: number = 123;
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                input
            );
        });
        test('Get number from function', () => {
            const generated: number = 123;
            const input = (handlerAgent: HandlerAgent, ...args: any) => {
                return generated;
            };
            expect(getValueOrFunctionReturn(input, mockHandlerAgent)).toBe(
                generated
            );
        });
    });
});

describe('getStringOrFunctionReturn - DEPRECATING IN 3.0.0', () => {
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

describe('getStringArrayOrFunctionReturn - DEPRECATING IN 3.0.0', () => {
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

describe('getJetstreamSubjectOrFunctionReturn - DEPRECATING IN 3.0.0', () => {
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
