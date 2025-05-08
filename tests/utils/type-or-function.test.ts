import {flattenTextUpdated, getStringOrFunctionReturn, HandlerAgent} from "../../src";
import {mockDeep} from "jest-mock-extended";

describe('getStringOrFunctionReturn', () => {
    const mockHandlerAgent = mockDeep<HandlerAgent>();
    test('getStringOrFunctionReturn with String', () => {

        const input = 'well actually';
        const expected = 'well actually';
        expect(getStringOrFunctionReturn(input, mockHandlerAgent)).toBe(expected);
    });
    test('getStringOrFunctionReturn with function', () => {
        const expected = 'example';

        const input = (handlerAgent: HandlerAgent, ...args: any) => {
            return expected;
        }
        expect(getStringOrFunctionReturn(input, mockHandlerAgent)).toBe(expected);
    });
});
