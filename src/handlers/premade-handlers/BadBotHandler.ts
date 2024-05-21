import { IsBadBotValidator } from '../../validations/BotValidators';
import { DebugLogAction } from '../../actions/LoggingActions';
import { HandlerAgent } from '../../agent/HandlerAgent';
import { CreateSkeetHandler } from '../skeet/CreateSkeetHandler';
import { ReplyToSkeetAction } from '../../actions/post/SkeetActions';
import { CreateSkeetMessage } from '../../types/JetstreamTypes';

// TODO I want to have .make() available on the premade handlers, but
//  the parameters don't match with the CreateSkeetHandler .make(), so i need a ts-ignore
//  I don't like using ts-ignore, cause that can lead to bugs popping up
// @ts-ignore
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

    static make(
        handlerAgent: HandlerAgent,
        response: string | undefined = undefined
    ): BadBotHandler {
        return new BadBotHandler(handlerAgent, response);
    }

    async handle(
        handlerAgent: HandlerAgent | undefined,
        message: CreateSkeetMessage
    ): Promise<void> {
        return super.handle(this.handlerAgent, message);
    }
}
