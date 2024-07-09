import { HandlerAgent } from '../../agent/HandlerAgent';
import { AbstractAction } from '../AbstractAction';

export class CreateFollowAction extends AbstractAction {
    constructor(
        protected userDid:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        userDid: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): CreateFollowAction {
        return new CreateFollowAction(userDid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.userDid == 'function') {
            this.userDid = this.userDid(handlerAgent, ...args);
        }
        await handlerAgent.followUser(this.userDid);
    }
}

export class DeleteFollowAction extends AbstractAction {
    constructor(
        protected userDid:
            | string
            | ((arg0: HandlerAgent, ...args: any) => string)
    ) {
        super();
    }

    static make(
        userDid: string | ((arg0: HandlerAgent, ...args: any) => string)
    ): DeleteFollowAction {
        return new DeleteFollowAction(userDid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        if (typeof this.userDid == 'function') {
            this.userDid = this.userDid(handlerAgent, ...args);
        }
        await handlerAgent.unfollowUser(this.userDid);
    }
}
