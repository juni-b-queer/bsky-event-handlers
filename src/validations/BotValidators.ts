import { isBadBotResponse, isGoodBotResponse } from '../utils/text-utils';
import { AbstractValidator } from './AbstractValidator';
import { HandlerAgent } from '../agent/HandlerAgent';
import { CreateSkeetMessage } from '../types/JetstreamTypes';

export class IsGoodBotValidator extends AbstractValidator {
    constructor() {
        super();
    }

    async shouldTrigger(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        const replyingToDid = handlerAgent.getDIDFromUri(
            // @ts-ignore
            message.record.reply?.parent.uri
        );
        const isReplyToBot =
            handlerAgent.getDid === replyingToDid &&
            message.collection == 'app.bsky.feed.post';
        return isGoodBotResponse(this.getTextFromPost(message)) && isReplyToBot;
    }
}

export class IsBadBotValidator extends AbstractValidator {
    constructor() {
        super();
    }

    async shouldTrigger(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        if (!handlerAgent.hasPostReply(message)) {
            return false;
        }
        const replyingToDid = handlerAgent.getDIDFromUri(
            // @ts-ignore
            message.record.reply?.parent.uri
        );
        const isReplyToBot =
            handlerAgent.getDid === replyingToDid &&
            message.collection == 'app.bsky.feed.post';
        return isBadBotResponse(this.getTextFromPost(message)) && isReplyToBot;
    }
}
