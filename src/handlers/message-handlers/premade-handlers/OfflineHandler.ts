import { InputIsCommandValidator } from '../../../validations/message-validators/post/StringValidators';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../../actions/message-actions/post/SkeetMessageActions';
import { CreateSkeetMessage } from '../../../types/JetstreamTypes';

// @ts-ignore
export class OfflineHandler extends CreateSkeetHandler {
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

    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: CreateSkeetMessage
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
