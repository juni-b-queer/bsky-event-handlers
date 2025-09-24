import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamSubject } from '../types/JetstreamTypes';

export function getValueOrFunctionReturn<T>(
    valueOrFunction: T | ((arg0: HandlerAgent, ...args: any) => T),
    handlerAgent: HandlerAgent,
    ...args: any
): T {
    if (typeof valueOrFunction === 'function') {
        // @ts-ignore
        return (valueOrFunction as (arg0: HandlerAgent, ...args: any[]) => T)(
            handlerAgent,
            ...args
        );
    } else {
        return valueOrFunction;
    }
}

/** Deprecating in 3.0.0, use getValueOrFunctionReturn instead */
export function getStringOrFunctionReturn(
    stringOrFunction: string | ((arg0: HandlerAgent, ...args: any) => string),
    handlerAgent: HandlerAgent,
    ...args: any
): string {
    if (typeof stringOrFunction == 'function') {
        return stringOrFunction(handlerAgent, ...args);
    } else {
        return stringOrFunction;
    }
}

/** Deprecating in 3.0.0, use getValueOrFunctionReturn instead */
export function getStringArrayOrFunctionReturn(
    stringArrayOrFunction:
        | string[]
        | ((arg0: HandlerAgent, ...args: any) => string[]),
    handlerAgent: HandlerAgent,
    ...args: any
): string[] {
    if (typeof stringArrayOrFunction == 'function') {
        return stringArrayOrFunction(handlerAgent, ...args);
    } else {
        return stringArrayOrFunction;
    }
}

/** Deprecating in 3.0.0, use getValueOrFunctionReturn instead */
export function getJetstreamSubjectOrFunctionReturn(
    subjectOrFunction:
        | JetstreamSubject
        | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject),
    handlerAgent: HandlerAgent,
    ...args: any
): JetstreamSubject {
    if (typeof subjectOrFunction == 'function') {
        return subjectOrFunction(handlerAgent, ...args);
    } else {
        return subjectOrFunction;
    }
}
