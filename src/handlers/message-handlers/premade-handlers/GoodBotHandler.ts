import { IsGoodBotValidator } from '../../../validations/message-validators/BotValidators';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamMessage,
} from '../../../types/JetstreamTypes';
// import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../../actions/message-actions/post/SkeetMessageActions';
import { MessageHandler } from '../MessageHandler';
import { CreateLikeAction } from '../../../actions/standard-bsky-actions/LikeActions';
import { DebugLogAction } from '../../../actions/LoggingActions';

// TODO see comment at top of BadBotHandler
// @ts-ignore
export class GoodBotHandler extends MessageHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        public response: string = 'Thank you 🥹'
    ) {
        super(
            [IsGoodBotValidator.make()],
            [
                ReplyToSkeetAction.make(response),
                CreateLikeAction.make(
                    MessageHandler.getUriFromMessage,
                    MessageHandler.getCidFromMessage
                ),
                DebugLogAction.make('GOOD BOT', `Told I'm good :)`),
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
