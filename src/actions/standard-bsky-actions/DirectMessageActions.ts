import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';
import { JetstreamSubject } from '../../types/JetstreamTypes';
import { getValueOrFunctionReturn } from '../../utils/type-or-function';

export class SendDMAction extends AbstractAction {
    constructor(
        protected userDID:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected messageText:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected embeddedPost:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ) {
        super();
    }

    static make(
        userDID: string | ((arg0: HandlerAgent, ...args: any) => string),
        messageText: string | ((arg0: HandlerAgent, ...args: any) => string),
        embeddedPost:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ): SendDMAction {
        return new SendDMAction(userDID, messageText, embeddedPost);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const did: string = getValueOrFunctionReturn(
            this.userDID,
            handlerAgent,
            ...args
        );
        const text: string = getValueOrFunctionReturn(
            this.messageText,
            handlerAgent,
            ...args
        );
        let embed: JetstreamSubject | undefined = undefined;
        if (this.embeddedPost !== undefined) {
            embed = getValueOrFunctionReturn(
                this.embeddedPost,
                handlerAgent,
                ...args
            );
        }

        await handlerAgent.sendMessageToUser(did, text, embed);
    }
}

export class SendDMToMultipleUsersAction extends AbstractAction {
    constructor(
        protected userDIDs:
            | string[]
            | ((arg0: HandlerAgent, ...args: any) => string[]),
        protected messageText:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected embeddedPost:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ) {
        super();
    }

    static make(
        userDIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        messageText: string | ((arg0: HandlerAgent, ...args: any) => string),
        embeddedPost:
            | JetstreamSubject
            | ((arg0: HandlerAgent, ...args: any) => JetstreamSubject)
            | undefined = undefined
    ): SendDMToMultipleUsersAction {
        return new SendDMToMultipleUsersAction(
            userDIDs,
            messageText,
            embeddedPost
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const dids: string[] = getValueOrFunctionReturn(
            this.userDIDs,
            handlerAgent,
            ...args
        );
        const text: string = getValueOrFunctionReturn(
            this.messageText,
            handlerAgent,
            ...args
        );
        let embed: JetstreamSubject | undefined = undefined;
        if (this.embeddedPost !== undefined) {
            embed = getValueOrFunctionReturn(
                this.embeddedPost,
                handlerAgent,
                ...args
            );
        }

        await handlerAgent.sendMessageToMultipleUsers(dids, text, embed);
    }
}
