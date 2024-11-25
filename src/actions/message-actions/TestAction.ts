import { HandlerAgent } from '../../agent/HandlerAgent';
import { JetstreamEventCommit, JetstreamMessage } from "../../types/JetstreamTypes";
import { DebugLog } from '../../utils/DebugLog';
import { AbstractMessageAction } from './AbstractMessageAction';

export class TestMessageAction extends AbstractMessageAction {
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<any | void> {
        DebugLog.info('Working', 'working');
    }
}
