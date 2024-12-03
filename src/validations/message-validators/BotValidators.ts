import { isBadBotResponse, isGoodBotResponse } from '../../utils/text-utils';
import { HandlerAgent } from '../../agent/HandlerAgent';
import {
    CreateSkeetMessage,
    JetstreamEventCommit,
} from '../../types/JetstreamTypes';
import { AbstractMessageValidator } from './AbstractMessageValidator';

export class IsGoodBotValidator extends AbstractMessageValidator {
    constructor() {
        super();
    }

    static make(): IsGoodBotValidator {
        return new IsGoodBotValidator();
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        const replyingToDid = handlerAgent.getDIDFromUri(
            // @ts-ignore
            message.commit.record.reply?.parent.uri
        );
        const isReplyToBot =
            handlerAgent.getDid === replyingToDid &&
            message.commit.collection == 'app.bsky.feed.post';
        return isGoodBotResponse(this.getTextFromPost(message)) && isReplyToBot;
    }
}

export class IsBadBotValidator extends AbstractMessageValidator {
    constructor() {
        super();
    }

    static make(): IsBadBotValidator {
        return new IsBadBotValidator();
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        const replyingToDid = handlerAgent.getDIDFromUri(
            // @ts-ignore
            message.commit.record.reply?.parent.uri
        );
        const isReplyToBot =
            handlerAgent.getDid === replyingToDid &&
            message.commit.collection == 'app.bsky.feed.post';
        return isBadBotResponse(this.getTextFromPost(message)) && isReplyToBot;
    }
}
