import {HandlerAgent} from "../agent/HandlerAgent";

export function getStringOrFunctionReturn(
    stringOrFunction:
        | string
        | ((arg0: HandlerAgent, ...args: any) => string),
    handlerAgent: HandlerAgent,
    ...args: any
): string {
    if (typeof stringOrFunction == 'function') {
        return stringOrFunction(handlerAgent, ...args);
    } else {
        return stringOrFunction;
    }
}