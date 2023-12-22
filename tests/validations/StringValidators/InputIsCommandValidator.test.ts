import {InputIsCommandValidator, ValidatorInput} from "../../../src";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {BskyAgent} from "@atproto/api";


describe('InputIsCommandValidator Class', () => {
    let inputIsCommandValidator: InputIsCommandValidator;
    let validatorInput: ValidatorInput;
    // @ts-ignore
    let repoOp = {
        payload: {
            text : 'Test message',
        }
    } as RepoOp;
    let bSkyAgent = {} as BskyAgent;

    beforeEach(() => {
        inputIsCommandValidator = new InputIsCommandValidator('key');
    });

    it('should test shouldTrigger function - Prefix case', async () => {
        validatorInput = {
            op: repoOp,
            repo: 'someRepo',
            agent: bSkyAgent
        };

        // @ts-ignore
        validatorInput.op.payload.text = '!key someCommand';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(true);

        // @ts-ignore
        validatorInput.op.payload.text = '!key';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(true);

        // @ts-ignore
        validatorInput.op.payload.text = 'someCommand !key';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(false);

        // @ts-ignore
        validatorInput.op.payload.text = 'someCommand';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(false);
    });

    it('should test shouldTrigger function - Suffix case', async () => {
        validatorInput = {
            op: repoOp,
            repo: 'someRepo',
            agent: bSkyAgent
        };

        // @ts-ignore
        validatorInput.op.payload.text = 'key! someCommand';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(true);

        // @ts-ignore
        validatorInput.op.payload.text = 'key!';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(true);

        // @ts-ignore
        validatorInput.op.payload.text = 'someCommand key!';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(false);

        // @ts-ignore
        validatorInput.op.payload.text = 'someCommand';
        expect(await inputIsCommandValidator.shouldTrigger(validatorInput)).toBe(false);
    });
});