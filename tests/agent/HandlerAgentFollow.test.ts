import dotenv from 'dotenv';
import { HandlerAgent } from '../../src';
import { BskyAgent } from '@atproto/api';

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
    let getProfileMock: jest.Mock<any, any, any>;
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
            getProfile: getProfileMock,
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

    it('IsFollowing should call agent getProfile and return true if following', async () => {
        getProfileMock = jest
            .fn()
            .mockReturnValue({ data: { viewer: { following: 'uri' } } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowing = await handlerAgent.isFollowing('isFollowing');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowing).toBe(true);
    });

    it('IsFollowing should call agent getProfile and return false if not following', async () => {
        getProfileMock = jest.fn().mockReturnValue({ data: { viewer: {} } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowing = await handlerAgent.isFollowing('badDid');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowing).toBe(false);
    });

    it('IsFollowing should call agent getFollows and return false if undefined response', async () => {
        getFollowsMock = jest
            .fn()
            .mockReturnValue({ data: { follows: undefined } });
        getProfileMock = jest.fn().mockReturnValue({ data: undefined });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowing = await handlerAgent.isFollowing('badDid');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowing).toBe(false);
    });

    it('IsFollowedBy should call agent getFollowers and return true if followed by', async () => {
        getProfileMock = jest
            .fn()
            .mockReturnValue({ data: { viewer: { followedBy: 'uri' } } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowedBy = await handlerAgent.isFollowedBy('isFollowedBy');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(true);
    });

    it('IsFollowedBy should call agent getFollowers and return false if not followed by', async () => {
        getProfileMock = jest.fn().mockReturnValue({ data: { viewer: {} } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowedBy = await handlerAgent.isFollowedBy('badDid');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(false);
    });

    it('IsFollowedBy should call agent getFollows and return false if undefined response', async () => {
        getFollowersMock = jest
            .fn()
            .mockReturnValue({ data: { followers: undefined } });
        getProfileMock = jest.fn().mockReturnValue({ data: undefined });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const isFollowedBy = await handlerAgent.isFollowedBy('badDid');
        expect(getProfileMock).toHaveBeenCalled();
        expect(isFollowedBy).toBe(false);
    });

    it('follow should call mock follow', async () => {
        const did = 'testDid';
        await handlerAgent.followUser(did);
        expect(followMock).toHaveBeenCalledWith(did);
    });

    it('deleteFollow should call mock deleteFollow and extract correct url', async () => {
        getProfileMock = jest
            .fn()
            .mockReturnValue({ data: { viewer: { following: 'uri' } } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
        const did = 'isFollowing';
        await handlerAgent.unfollowUser(did);
        expect(getProfileMock).toHaveBeenCalledWith({ actor: did });
        expect(deleteFollowMock).toHaveBeenCalledWith('uri');
    });

    it('deleteFollow should return false when no profile', async () => {
        const followsRespMock = undefined;
        getProfileMock = jest.fn().mockReturnValue({ data: undefined });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );

        const did = 'isFollowing';
        const resp = await handlerAgent.unfollowUser(did);
        expect(getProfileMock).toHaveBeenCalledWith({ actor: did });

        expect(deleteFollowMock).not.toHaveBeenCalled();
        expect(resp).toBe(false);
    });

    it('deleteFollow should return false when no profile', async () => {
        const followsRespMock = undefined;
        getProfileMock = jest.fn().mockReturnValue({ data: { viewer: {} } });
        const mockedAgent = {
            getFollows: getFollowsMock,
            getFollowers: getFollowersMock,
            follow: followMock,
            deleteFollow: deleteFollowMock,
            getProfile: getProfileMock,
        } as unknown as BskyAgent;
        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );

        const did = 'isFollowing';
        const resp = await handlerAgent.unfollowUser(did);
        expect(getProfileMock).toHaveBeenCalledWith({ actor: did });

        expect(deleteFollowMock).not.toHaveBeenCalled();
        expect(resp).toBe(false);
    });
});
