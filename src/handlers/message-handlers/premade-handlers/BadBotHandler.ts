import { IsBadBotValidator } from '../../../validations/message-validators/BotValidators';
import { DebugLogAction } from '../../../actions/LoggingActions';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { MessageHandler } from '../MessageHandler';
import { CreateLikeAction } from '../../../actions/standard-bsky-actions/LikeActions';
import { CreateSkeetAction } from '../../../actions/standard-bsky-actions/SkeetActions';

// TODO I want to have .make() available on the premade handlers, but
//  the parameters don't match with the CreateSkeetHandler .make(), so i need a ts-ignore
//  I don't like using ts-ignore, cause that can lead to bugs popping up
// @ts-ignore
export class BadBotHandler extends MessageHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        public response: string = "I'm sorry 😓"
    ) {
        super(
            [IsBadBotValidator.make()],
            [
                CreateSkeetAction.make(
                    response,
                    MessageHandler.generateReplyFromMessage
                ),
                CreateLikeAction.make(
                    MessageHandler.getUriFromMessage,
                    MessageHandler.getCidFromMessage
                ),
                DebugLogAction.make('BAD BOT', `Told I'm bad :(`),
            ],
            handlerAgent
        );
    }

    static make(
        handlerAgent: HandlerAgent,
        response: string | undefined = undefined
    ): BadBotHandler {
        return new BadBotHandler(handlerAgent, response);
    }

    // TODO Update to use JetstreamEventCommit
    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamEventCommit
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
