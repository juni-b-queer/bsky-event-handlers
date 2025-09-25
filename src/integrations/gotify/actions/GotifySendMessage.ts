import { AbstractAction } from '../../../actions/AbstractAction';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { DebugLog } from '../../../utils/DebugLog';
import { GotifyClient } from '../GotifyClient';
import { getValueOrFunctionReturn } from '../../../utils/type-or-function';

export class GotifySendMessage extends AbstractAction {
    constructor(
        protected client: GotifyClient,
        protected title:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected message:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string),
        protected priority:
            | number
            | ((arg0: HandlerAgent, ...args: any) => number) = 1
    ) {
        super();
    }

    static make(
        client: GotifyClient,
        title: string | ((arg0: HandlerAgent, ...args: any) => string),
        message: string | ((arg0: HandlerAgent, ...args: any) => string),
        priority:
            | number
            | ((arg0: HandlerAgent, ...args: any) => number)
            | undefined = undefined
    ): GotifySendMessage {
        return new GotifySendMessage(client, title, message, priority);
    }

    public getClient(): GotifyClient {
        return this.client;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        const title = getValueOrFunctionReturn(
            this.title,
            handlerAgent,
            ...args
        );
        const message = getValueOrFunctionReturn(
            this.message,
            handlerAgent,
            ...args
        );
        const priority = getValueOrFunctionReturn(
            this.priority,
            handlerAgent,
            ...args
        );
        const res = await this.client.sendMessage(title, message, priority);
        if (res) {
            DebugLog.info('GOTIFY', 'Successfully sent message');
        } else {
            DebugLog.warn('GOTIFY', 'Failed to send message');
        }
    }
}
