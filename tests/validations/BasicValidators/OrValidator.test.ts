import {
    AgentDetails,
    InputContainsValidator, InputEqualsValidator,
    InputStartsWithValidator,
    IsReplyValidator, OrValidator,
    ValidatorInput
} from "../../../src";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {BskyAgent} from "@atproto/api";


describe('IsReplyValidator', () => {
    let key = "test"
    const startsWithKeyValidator = new InputStartsWithValidator("test");
    const equalsKeyValidator = new InputEqualsValidator("test");
    const orValidator = new OrValidator([startsWithKeyValidator, equalsKeyValidator])

    test('shouldTrigger returns true if both validators pass', async () => {
        const op: RepoOp = {
            payload:{
                text: 'test',
            }
        } as unknown as RepoOp;
        
        const validatorInput: ValidatorInput = {
            op: op,
            repo: 'testRepo',
            agentDetails: {} as AgentDetails,
        };
        
        expect(await orValidator.shouldTrigger(validatorInput)).toBe(true);
    });

    test('shouldTrigger returns true if one validator passes', async () => {
        const op: RepoOp = {
            payload:{
                text: 'test message',
            }
        } as unknown as RepoOp;

        const validatorInput: ValidatorInput = {
            op: op,
            repo: 'testRepo',
            agentDetails: {} as AgentDetails,
        };

        expect(await orValidator.shouldTrigger(validatorInput)).toBe(true);
    });

    test('shouldTrigger returns false if no validators pass', async () => {
        const op: RepoOp = {
            payload:{
                text: 'random',
            }
        } as unknown as RepoOp;

        const validatorInput: ValidatorInput = {
            op: op,
            repo: 'testRepo',
            agentDetails: {} as AgentDetails,
        };

        expect(await orValidator.shouldTrigger(validatorInput)).toBe(false);
    });

});