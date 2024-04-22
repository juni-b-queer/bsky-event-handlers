import {AbstractValidator} from "./AbstractValidator";
import {CreateSkeetMessage} from "../types/JetstreamTypes";
import {HandlerAgent} from "../agent/HandlerAgent";

export class ActionTakenByUserValidator extends AbstractValidator {
    constructor(private userDid: string) {
        super();
    }

    async shouldTrigger(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent,
    ): Promise<boolean> {
        return this.userDid === message.did;
    }
}
