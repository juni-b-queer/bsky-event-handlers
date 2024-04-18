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
  const postMock = jest.fn();
  const deletePostMock = jest.fn();
  const likeMock = jest.fn();
  const deleteLikeMock = jest.fn();
  const repostMock = jest.fn();
  const deleteRepostMock = jest.fn();
  beforeEach(() => {
    if (testHandle !== undefined && testPassword !== undefined) {
      // Require mocked module and define class' methods
      const mockedAgent = {
        post: postMock,
        deletePost: deletePostMock,
        like: likeMock,
        deleteLike: deleteLikeMock,
        repost: repostMock,
        deleteRepost: deleteRepostMock
      } as unknown as BskyAgent;
      handlerAgent = new HandlerAgent(
        "agentName",
        testHandle,
        testPassword,
        mockedAgent,
      );
    }
  });

  it("post should call post with input", async () => {
    const input = {
      text: "Test post",
      reply: undefined,
    };
    await handlerAgent.post(input);
    expect(postMock).toBeCalledWith(input)
  });

  describe("CreateSkeet", () =>{
    it("createSkeet should call post with input text and no reply if no existingPostDetails", async () => {
      // todo
    });

    it("createSkeet should call post with input text and reply if existingPostDetails is present", async () => {
      // todo
    });

    it("createSkeet should call post with input text and root reply if existingPostDetails is present and a reply", async () => {
      // todo
    });
  })

  it("DeleteSkeet should call deletePost for given post", async () => {
    await handlerAgent.deleteSkeet("skeetURI");
    expect(deletePostMock).toBeCalledWith("skeetURI");
  });

  describe("Like", () =>{
    it("likeSkeet should call like for given post", async () => {
      await handlerAgent.likeSkeet("skeetURI", "skeetCID");
      expect(likeMock).toBeCalledWith("skeetURI", "skeetCID");
    });

    it("unlikeSkeet should call deleteLike for given post", async () => {
      await handlerAgent.unlikeSkeet("likeURI");
      expect(deleteLikeMock).toBeCalledWith("likeURI");
    });
  })

  describe("Reskeet", () =>{
    it("reskeet should call repost for given post", async () => {
      await handlerAgent.reskeetSkeet("skeetURI", "skeetCID");
      expect(repostMock).toBeCalledWith("skeetURI", "skeetCID");
    });

    it("unreskeet should call deleteRepost for given post", async () => {
      await handlerAgent.unreskeetSkeet("reskeetURI");
      expect(deleteRepostMock).toBeCalledWith("reskeetURI");
    });
  })

});
