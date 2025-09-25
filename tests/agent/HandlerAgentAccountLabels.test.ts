import { AtpAgent } from '@atproto/api';
import { mockDeep } from 'jest-mock-extended';
import { HandlerAgent } from '../../src';

describe('HandlerAgentAccountLabels', () => {
    const mockAtpAgent = mockDeep<AtpAgent>();
    const sessData = {
        did: 'did:plc:mockdid',
        handle: 'mockhandle.test',
        email: 'mock@example.com',
        emailConfirmed: true,
        accessJwt: 'mock-access-jwt',
        refreshJwt: 'mock-refresh-jwt',
    };
    Object.defineProperty(mockAtpAgent, 'session', {
        value: sessData,
        writable: false,
    });
    let handlerAgent: HandlerAgent;

    const mockBotGetProfileResponse = {
        success: true,
        headers: {},
        data: {
            did: 'did:plc:mockdid',
            labels: [
                {$type: 'app.bsky.profile.defs#label', uri: 'at://did:plc:mockdid/app.bsky.profile.label/label1', cid: 'botCid'},
            ]
        },
    };

    const mockOtherGetProfileResponse = {
        success: true,
        headers: {},
        data: {
            did: 'did:plc:otherdid',
            labels: [
                {$type: 'app.bsky.profile.defs#label', uri: 'at://did:plc:mockdid/app.bsky.profile.label/label2', cid: 'otherCid'},

            ]
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();

        handlerAgent = new HandlerAgent(
            'agentName',
            'testHandle',
            'testPassword',
            mockAtpAgent
        );
    });

    describe('getProfile', () => {
        it('getProfile with did returns the profile data of given did', async () => {
            mockAtpAgent.getProfile.mockResolvedValue(
                // @ts-ignore
                mockOtherGetProfileResponse
            );
            const resp = await handlerAgent.getProfile(mockOtherGetProfileResponse.data.did);

            expect(mockAtpAgent.getProfile).toHaveBeenCalledWith({
                actor: mockOtherGetProfileResponse.data.did,
            });
            expect(resp).toBe(mockOtherGetProfileResponse.data);
        });

        it('getProfile without did returns the profile data of bot', async () => {
            mockAtpAgent.getProfile.mockResolvedValue(
                // @ts-ignore
                mockBotGetProfileResponse
            );
            const resp = await handlerAgent.getProfile();

            expect(mockAtpAgent.getProfile).toHaveBeenCalledWith({
                actor: handlerAgent.getDid,
            });
            expect(resp).toBe(mockBotGetProfileResponse.data);
        });
    });

    describe('getAccountLabels', () => {
        it('getAccountLabels with did returns the labels of given did', async () => {
            mockAtpAgent.getProfile.mockResolvedValue(
                // @ts-ignore
                mockOtherGetProfileResponse
            );
            const resp = await handlerAgent.getAccountLabels(mockOtherGetProfileResponse.data.did);

            expect(mockAtpAgent.getProfile).toHaveBeenCalledWith({
                actor: mockOtherGetProfileResponse.data.did,
            });
            expect(resp).toBe(mockOtherGetProfileResponse.data.labels);
        });

        it('getProfile without did returns the profile data of bot', async () => {
            mockAtpAgent.getProfile.mockResolvedValue(
                // @ts-ignore
                mockBotGetProfileResponse
            );
            const resp = await handlerAgent.getAccountLabels();

            expect(mockAtpAgent.getProfile).toHaveBeenCalledWith({
                actor: handlerAgent.getDid,
            });
            expect(resp).toBe(mockBotGetProfileResponse.data.labels);
        });
    });
});
