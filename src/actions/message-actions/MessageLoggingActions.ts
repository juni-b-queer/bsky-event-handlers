import { AbstractMessageAction } from './AbstractMessageAction';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    JetstreamEventCommit,
    JetstreamMessage,
} from '../../types/JetstreamTypes';

export class LogMessageAction extends AbstractMessageAction {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any

    static make(): LogMessageAction {
        return new LogMessageAction();
    }
    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<any> {
        console.log(message);
    }
}
