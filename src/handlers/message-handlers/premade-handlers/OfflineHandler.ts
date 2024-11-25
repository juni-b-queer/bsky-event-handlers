import { InputIsCommandValidator } from '../../../validations/message-validators/post/StringValidators';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { ReplyToSkeetAction } from '../../../actions/message-actions/post/SkeetMessageActions';
import { CreateSkeetMessage, JetstreamEventCommit } from "../../../types/JetstreamTypes";
import { MessageHandler } from '../MessageHandler';

// @ts-ignore
export class OfflineHandler extends MessageHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        private command: string,
        private response: string = 'Bot functionality offline'
    ) {
        super(
            [new InputIsCommandValidator(command, false)],
            [new ReplyToSkeetAction(response)],
            handlerAgent
        );
    }

    static make(
        handlerAgent: HandlerAgent,
        command: string,
        response: string | undefined = undefined
    ): OfflineHandler {
        return new OfflineHandler(handlerAgent, command, response);
    }

    // TODO Update to use JetstreamEventCommit
    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamEventCommit
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
