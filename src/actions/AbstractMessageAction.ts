import { RepoOp } from '@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos';
import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { DebugLog } from '../utils/DebugLog';

export abstract class AbstractMessageAction {
    constructor() {}

    // @ts-ignore
    abstract async handle(
        message: JetstreamMessage,
        handlerAgent: HandlerAgent
    ): Promise<any | void>;
}
