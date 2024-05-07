import { IsBadBotValidator } from '../../validations/BotValidators';
import { DebugLogAction } from '../../actions/LoggingActions';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../actions/post/SkeetActions';
import { CreateSkeetMessage } from '../../types/JetstreamTypes';

export class BadBotHandler extends CreateSkeetHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        public response: string = "I'm sorry 😓"
    ) {
        super(
            [new IsBadBotValidator()],
            [
                new ReplyToSkeetAction(response),
                new DebugLogAction('BAD BOT', `Told I'm bad :(`),
            ],
            handlerAgent
        );
    }

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}
