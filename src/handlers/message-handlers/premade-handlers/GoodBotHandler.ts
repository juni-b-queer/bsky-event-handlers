import { IsGoodBotValidator } from '../../../validations/message-validators/BotValidators';
import { DebugLogAction } from '../../../actions/message-actions/LoggingActions';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { CreateSkeetMessage } from '../../../types/JetstreamTypes';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../../actions/message-actions/post/SkeetMessageActions';

// TODO see comment at top of BadBotHandler
// @ts-ignore
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

    static make(
        handlerAgent: HandlerAgent,
        response: string | undefined = undefined
    ): GoodBotHandler {
        return new GoodBotHandler(handlerAgent, response);
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: CreateSkeetMessage
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
