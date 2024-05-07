import { IsGoodBotValidator } from '../../validations/BotValidators';
import { DebugLogAction } from '../../actions/LoggingActions';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { ReplyToSkeetAction } from '../../actions/post/SkeetActions';
import { CreateSkeetMessage } from '../../types/JetstreamTypes';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';

export class GoodBotHandler extends CreateSkeetHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        public response: string = 'Thank you 🥹'
    ) {
        super(
            [new IsGoodBotValidator()],
            [
                new ReplyToSkeetAction(response),
                new DebugLogAction('GOOD BOT', `Told I'm good :)`),
            ],
            handlerAgent
        );
    }

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}
