import { HandlerAgent } from '../../../agent/HandlerAgent';
import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { MessageHandler } from '../MessageHandler';
import { ReplyingToBotValidator } from '../../../validations/message-validators/post/PostValidators';
import { BadBotHandler } from './BadBotHandler';
import { GoodBotHandler } from './GoodBotHandler';

// @ts-ignore
export class GoodAndBadBotHandler extends MessageHandler {
    constructor(
        public handlerAgent: HandlerAgent,
        public goodResponse: string = 'Thank you 🥹',
        public badResponse: string = "I'm sorry 😓"
    ) {
        super(
            [ReplyingToBotValidator.make()],
            [
                GoodBotHandler.make(handlerAgent, goodResponse),
                BadBotHandler.make(handlerAgent, badResponse),
            ],
            handlerAgent
        );
    }

    static make(
        handlerAgent: HandlerAgent,
        goodResponse: string | undefined = undefined,
        badResponse: string | undefined = undefined
    ): GoodAndBadBotHandler {
        return new GoodAndBadBotHandler(
            handlerAgent,
            goodResponse,
            badResponse
        );
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: JetstreamEventCommit
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
