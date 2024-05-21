import { HandlerAgent } from '../agent/HandlerAgent';
import { JetstreamMessage } from '../types/JetstreamTypes';
import { DebugLog } from '../utils/DebugLog';
import { AbstractMessageAction } from './AbstractMessageAction';

export class TestAction extends AbstractMessageAction {
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamMessage
    ): Promise<any | void> {
        DebugLog.info('Working', 'working');
    }
}
