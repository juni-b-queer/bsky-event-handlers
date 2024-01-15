import {
    AgentDetails,
    InputContainsValidator,
    IsReplyValidator,
    PostedByUserValidator,
    ValidatorInput
} from "../../../src";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {BskyAgent} from "@atproto/api";


describe('IsReplyValidator', () => {
    const validator = new PostedByUserValidator("did:plc:2bnsooklzchcu5ao7xdjosrs");

    test('shouldTrigger returns true if op.payload.reply is not null', async () => {
        const op: RepoOp = {
            payload:{
                text: 'test message',
            }
        } as unknown as RepoOp;
        
        const validatorInput: ValidatorInput = {
            op: op,
            repo: 'did:plc:2bnsooklzchcu5ao7xdjosrs',
            agentDetails: {} as AgentDetails,
        };
        
        expect(await validator.shouldTrigger(validatorInput)).toBe(true);
    });

    test('shouldTrigger returns false if op.payload.reply is null', async () => {
        const op: RepoOp = {
            payload:{
                text: 'test message',
            }
        } as unknown as RepoOp;

        const validatorInput: ValidatorInput = {
            op: op,
            repo: 'bad',
            agentDetails: {} as AgentDetails,
        };

        expect(await validator.shouldTrigger(validatorInput)).toBe(false);
    });

});