import dotenv from 'dotenv';
import { HandlerAgent } from '../../src';
import atprotoApiMock, { AtpSessionData, BskyAgent } from '@atproto/api';
import clearAllMocks = jest.clearAllMocks;

dotenv.config();

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string = 'testhandle';
    const testPassword: string = 'testpassword';

    const followingMocks = [
        {
            did: 'isFollowing',
            viewer: {
                following: 'followLink',
            },
        },
    ];

    const followedByMocks = [
        {
            did: 'isFollowedBy',
            viewer: {
                following: 'followLink',
                followedBy: 'followedByLink',
            },
        },
    ];
    let getFollowsMock: jest.Mock<any, any, any>;
    let getFollowersMock: jest.Mock<any, any, any>;
    const followMock = jest.fn();
    const deleteFollowMock = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        getFollowsMock = jest
            .fn()
            .mockReturnValue({ data: { follows: followingMocks } });
        getFollowersMock = jest
            .fn()
            .mockReturnValue({ data: { followers: followedByMocks } });
        // Require mocked module and define class' methods
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
    });

    it('Get Follows should call agent getFollow', async () => {
        const follows = await handlerAgent.getFollows();
        expect(getFollowsMock).toHaveBeenCalled();
        expect(follows).toEqual(followingMocks);
    });

    it('Get Followers should call agent getFollowers', async () => {
        const followers = await handlerAgent.getFollowers();
        expect(getFollowersMock).toHaveBeenCalled();
        expect(followers).toEqual(followedByMocks);
    });

    it('IsFollowing should call agent getFollows and return true if following', async () => {
        const isFollowing = await handlerAgent.isFollowing('isFollowing');
        expect(getFollowsMock).toHaveBeenCalled();
        expect(isFollowing).toBe(true);
    });

    it('IsFollowing should call agent getFollows and return false if not following', async () => {
        const isFollowing = await handlerAgent.isFollowing('badDid');
        expect(getFollowsMock).toHaveBeenCalled();
        expect(isFollowing).toBe(false);
    });

    it('IsFollowing should call agent getFollows and return false if undefined response', async () => {
        getFollowsMock = jest
            .fn()
            .mockReturnValue({ data: { follows: undefined } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowing = await handlerAgent.isFollowing('badDid');
        expect(getFollowsMock).toHaveBeenCalled();
        expect(isFollowing).toBe(false);
    });

    it('IsFollowedBy should call agent getFollowers and return true if followed by', async () => {
        const isFollowedBy = await handlerAgent.isFollowedBy('isFollowedBy');
        expect(getFollowersMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(true);
    });

    it('IsFollowedBy should call agent getFollowers and return false if not followed by', async () => {
        const isFollowedBy = await handlerAgent.isFollowedBy('badDid');
        expect(getFollowersMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(false);
    });

    it('IsFollowedBy should call agent getFollows and return false if undefined response', async () => {
        getFollowersMock = jest
            .fn()
            .mockReturnValue({ data: { followers: undefined } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowedBy = await handlerAgent.isFollowedBy('badDid');
        expect(getFollowersMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(false);
    });

    it('follow should call mock follow', async () => {
        const did = 'testDid';
        await handlerAgent.followUser(did);
        expect(followMock).toHaveBeenCalledWith(did);
    });

    it('deleteFollow should call mock deleteFollow and extract correct url', async () => {
        const did = 'isFollowing';
        await handlerAgent.unfollowUser(did);
        expect(deleteFollowMock).toHaveBeenCalledWith('followLink');
    });

    it('deleteFollow should return false when getFollows is undefined', async () => {
        const followsRespMock = undefined;
        getFollowsMock = jest.fn().mockReturnValue({
            data: {
                follows: followsRespMock,
            },
        });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );

        const mockGetRecordForDid = jest.fn().mockReturnValue({});
        handlerAgent.getRecordForDid = mockGetRecordForDid;
        const did = 'isFollowing';
        const resp = await handlerAgent.unfollowUser(did);
        expect(mockGetRecordForDid).not.toHaveBeenCalled();
        expect(deleteFollowMock).not.toHaveBeenCalled();
        expect(resp).toBe(false);
    });

    it('deleteFollow should return false when getFollows is undefined', async () => {
        const followsRespMock = [
            {
                did: 'isFollowing',
                viewer: {
                    following: undefined,
                    followedBy: undefined,
                },
            },
        ];
        getFollowsMock = jest.fn().mockReturnValue({
            data: {
                follows: followsRespMock,
            },
        });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );

        const mockGetRecordForDid = jest.fn().mockReturnValue({});
        handlerAgent.getRecordForDid = mockGetRecordForDid;
        const did = 'isFollowing';
        const resp = await handlerAgent.unfollowUser(did);
        expect(mockGetRecordForDid).toHaveBeenCalledWith(did, followsRespMock);
        expect(deleteFollowMock).not.toHaveBeenCalled();
        expect(resp).toBe(false);
    });
});
