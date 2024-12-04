import dotenv from 'dotenv';
import { HandlerAgent } from '../../src';
import { BskyAgent } from '@atproto/api';

dotenv.config();

describe('HandlerAgent Post Count', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string = 'testhandle';
    const testPassword: string = 'testpassword';

    // Mock data to be returned by the agent.getPostThread function
    const mockPostThreadResponse = {
        data: {
            thread: {
                post: {
                    uri: 'at://did:plc:example/app.bsky.feed.post/rkey',
                    cid: 'examplecid',
                    replyCount: 1,
                    repostCount: 0,
                    likeCount: 2,
                    quoteCount: 0,
                },
            },
        },
        headers: {
            header: '*',
        },
        success: true,
    };

    let getPostThreadMock: jest.Mock<any, any, any>;

    beforeEach(() => {
        jest.clearAllMocks();
        getPostThreadMock = jest.fn().mockResolvedValue(mockPostThreadResponse);

        const mockedAgent = {
            getPostThread: getPostThreadMock,
        } as unknown as BskyAgent;

        handlerAgent = new HandlerAgent(
            'agentName',
            testHandle,
            testPassword,
            mockedAgent
        );
    });

    it('should return correct like count for a post', async () => {
        const likeCount = await handlerAgent.getPostLikeCount('someUri');
        expect(getPostThreadMock).toHaveBeenCalledWith({ uri: 'someUri' });
        expect(likeCount).toBe(2);
    });

    it('should return correct repost count for a post', async () => {
        const repostCount = await handlerAgent.getPostRepostCount('someUri');
        expect(getPostThreadMock).toHaveBeenCalledWith({ uri: 'someUri' });
        expect(repostCount).toBe(0);
    });

    it('should return correct reply count for a post', async () => {
        const replyCount = await handlerAgent.getPostReplyCount('someUri');
        expect(getPostThreadMock).toHaveBeenCalledWith({ uri: 'someUri' });
        expect(replyCount).toBe(1);
    });

    it('should return correct quote count for a post', async () => {
        const quoteCount = await handlerAgent.getPostQuoteCount('someUri');
        expect(getPostThreadMock).toHaveBeenCalledWith({ uri: 'someUri' });
        expect(quoteCount).toBe(0);
    });
});
