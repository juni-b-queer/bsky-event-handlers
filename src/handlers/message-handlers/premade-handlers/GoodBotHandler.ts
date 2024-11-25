import { IsGoodBotValidator } from '../../../validations/message-validators/BotValidators';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamEventCommit,
    JetstreamMessage,
} from '../../../types/JetstreamTypes';
// import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../../actions/message-actions/post/SkeetMessageActions';
import { MessageHandler } from '../MessageHandler';
import { CreateLikeAction } from '../../../actions/standard-bsky-actions/LikeActions';
import { DebugLogAction } from '../../../actions/LoggingActions';
import { CreateSkeetAction } from '../../../actions/standard-bsky-actions/SkeetActions';

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
                CreateSkeetAction.make(
                    response,
                    MessageHandler.generateReplyFromMessage
                ),
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

    // TODO Update to use JetstreamEventCommit
    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamEventCommit
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
