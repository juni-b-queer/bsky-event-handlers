import dotenv from "dotenv";
import { HandlerAgent } from "../../src";
import atprotoApiMock, { AtpSessionData, BskyAgent } from "@atproto/api";

dotenv.config();

describe("HandlerAgent", () => {
  let handlerAgent: HandlerAgent;
  const testHandle: string | undefined =
    process.env.TEST_HANDLE ?? "testhandle";
  const testPassword: string | undefined =
    process.env.TEST_PASSWORD ?? "testpassword";

  let followingMocks = [
      {
        did: "isFollowing",
        viewer:{
          following: "followLink"
        }
      }
  ]

  let followedByMocks = [
    {
      did: "isFollowedBy",
      viewer:{
        following: "followLink",
        followedBy: "followedByLink"
      }
    }
  ]


  const getFollowsMock = jest.fn().mockReturnValue({ data: {follows: followingMocks} })
  const getFollowersMock = jest.fn().mockReturnValue({ data: {followers: followedByMocks} })
  const followMock = jest.fn();
  const deleteFollowMock = jest.fn();
  beforeEach(() => {
    if (testHandle !== undefined && testPassword !== undefined) {
      // Require mocked module and define class' methods
      const mockedAgent = {
        getFollows: getFollowsMock,
        getFollowers: getFollowersMock,
        follow: followMock,
        deleteFollow: deleteFollowMock
      } as unknown as BskyAgent;
      handlerAgent = new HandlerAgent(
        "agentName",
        testHandle,
        testPassword,
        mockedAgent,
      );
    }
  });

  it("Get Follows should call agent getFollow", async () => {
    const follows = await handlerAgent.getFollows();
    expect(getFollowsMock).toHaveBeenCalled();
    console.log(follows)
    expect(follows).toEqual(followingMocks);
  });

  it("Get Followers should call agent getFollowers", async () => {
    const followers = await handlerAgent.getFollowers();
    expect(getFollowersMock).toHaveBeenCalled();
    expect(followers).toEqual(followedByMocks);
  });

  it("IsFollowing should call agent getFollows and return true if following", async () => {
    const isFollowing = await handlerAgent.isFollowing("isFollowing");
    expect(getFollowsMock).toHaveBeenCalled();
    expect(isFollowing).toBe(true);
  });

  it("IsFollowing should call agent getFollows and return false if not following", async () => {
    const isFollowing = await handlerAgent.isFollowing("badDid");
    expect(getFollowsMock).toHaveBeenCalled();
    expect(isFollowing).toBe(false);
  });

  it("IsFollowedBy should call agent getFollowers and return true if followed by", async () => {
    const isFollowedBy = await handlerAgent.isFollowedBy("isFollowedBy");
    expect(getFollowersMock).toHaveBeenCalled();
    expect(isFollowedBy).toBe(true);
  });

  it("IsFollowedBy should call agent getFollowers and return false if not followed by", async () => {
    const isFollowedBy = await handlerAgent.isFollowedBy("badDid");
    expect(getFollowersMock).toHaveBeenCalled();
    expect(isFollowedBy).toBe(false);
  });

  it("follow should call mock follow", async () => {
    const did = "testDid";
    await handlerAgent.followUser(did);
    expect(followMock).toHaveBeenCalledWith(did);
  });

  it("deleteFollow should call mock deleteFollow and extract correct url", async () => {
    const did = "isFollowing";
    await handlerAgent.unfollowUser(did);
    expect(deleteFollowMock).toHaveBeenCalledWith("followLink");
  });
});
