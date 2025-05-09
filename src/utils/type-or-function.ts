import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamSubject } from '../types/JetstreamTypes';

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
