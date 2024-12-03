import { flattenTextUpdated } from '../../../utils/text-utils';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { JetstreamEventCommit } from '../../../types/JetstreamTypes';
import { AbstractMessageValidator } from '../AbstractMessageValidator';

export class InputIsCommandValidator extends AbstractMessageValidator {
    constructor(
        private triggerKey: string,
        private strict: boolean = true
    ) {
        super();
    }

    static make(
        triggerKey: string,
        strict: boolean | undefined = undefined
    ): InputIsCommandValidator {
        return new InputIsCommandValidator(triggerKey, strict);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        if (this.strict) {
            const input = this.getTextFromPost(message);
            return (
                input.startsWith(`!${this.triggerKey}`) ||
                input.startsWith(`${this.triggerKey}!`)
            );
        } else {
            const input = this.getTextFromPost(message).toLowerCase();
            const lowerCaseTriggerKey = this.triggerKey.toLowerCase();
            return (
                input.startsWith(`!${lowerCaseTriggerKey}`) ||
                input.startsWith(`${lowerCaseTriggerKey}!`)
            );
        }
    }
}

export class InputStartsWithValidator extends AbstractMessageValidator {
    constructor(
        private triggerKey: string,
        private strict: boolean = false
    ) {
        super();
    }

    static make(
        triggerKey: string,
        strict: boolean | undefined = undefined
    ): InputStartsWithValidator {
        return new InputStartsWithValidator(triggerKey, strict);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const input = this.getTextFromPost(message);
        if (this.strict) {
            return input.startsWith(this.triggerKey);
        }
        const flatText = flattenTextUpdated(this.triggerKey, input);
        return flatText.startsWith(this.triggerKey);
    }
}

export class InputContainsValidator extends AbstractMessageValidator {
    constructor(
        private triggerKey: string,
        private strict: boolean = false
    ) {
        super();
    }

    static make(
        triggerKey: string,
        strict: boolean | undefined = undefined
    ): InputContainsValidator {
        return new InputContainsValidator(triggerKey, strict);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const input = this.getTextFromPost(message);
        if (this.strict) {
            return input.includes(this.triggerKey);
        }
        const flatText = flattenTextUpdated(this.triggerKey, input);
        return flatText.includes(this.triggerKey);
    }
}

export class InputEqualsValidator extends AbstractMessageValidator {
    constructor(private triggerKey: string) {
        super();
    }

    static make(triggerKey: string): InputEqualsValidator {
        return new InputEqualsValidator(triggerKey);
    }

    async handle(
        handlerAgent: HandlerAgent,
        message: JetstreamEventCommit
    ): Promise<boolean> {
        const input = this.getTextFromPost(message);
        return input === this.triggerKey;
    }
}
