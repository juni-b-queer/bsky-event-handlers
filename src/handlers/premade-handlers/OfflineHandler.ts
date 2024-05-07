import { InputIsCommandValidator } from '../../validations/post/StringValidators';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../actions/post/SkeetActions';
import { CreateSkeetMessage } from '../../types/JetstreamTypes';

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

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}
