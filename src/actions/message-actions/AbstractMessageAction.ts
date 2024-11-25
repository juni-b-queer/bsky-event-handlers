import { HandlerAgent } from '../../agent/HandlerAgent';
import { JetstreamEventCommit, JetstreamMessage } from "../../types/JetstreamTypes";
import { AbstractAction } from '../AbstractAction';

export abstract class AbstractMessageAction extends AbstractAction {
    constructor() {
        super();
    }

    static make(...args: any): AbstractMessageAction {
        throw new Error('Method not implemented! Use constructor!');
    }

    // @ts-ignore
    abstract async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<any | void>;
}
