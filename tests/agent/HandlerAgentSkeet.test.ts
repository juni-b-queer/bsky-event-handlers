import dotenv from 'dotenv';
import {
    DebugLog,
    HandlerAgent,
    Reply,
    ReplyFactory,
    Subject,
    SubjectFactory,
} from '../../src';
import { BskyAgent } from '@atproto/api';

dotenv.config();

describe('HandlerAgent', () => {
    let handlerAgent: HandlerAgent;
    const testHandle: string | undefined =
        process.env.TEST_HANDLE ?? 'testhandle';
    const testPassword: string | undefined =
        process.env.TEST_PASSWORD ?? 'testpassword';
    const postMock = jest.fn();
    const deletePostMock = jest.fn();
    const likeMock = jest.fn();
    const deleteLikeMock = jest.fn();
    const repostMock = jest.fn();
    const deleteRepostMock = jest.fn();
    const mockRecord = {
        value: {
            subject: {
                uri: 'skeetURI',
            },
        },
        uri: 'recordURI',
    };
    const listRecordsMock = jest.fn().mockReturnValue({
        data: {
            cursor: 'text',
            records: [mockRecord],
        },
    });
    beforeEach(() => {
        jest.clearAllMocks();
        if (testHandle !== undefined && testPassword !== undefined) {
            // Require mocked module and define class' methods
            const mockedAgent = {
                post: postMock,
                deletePost: deletePostMock,
                like: likeMock,
                deleteLike: deleteLikeMock,
                repost: repostMock,
                deleteRepost: deleteRepostMock,
                api: {
                    com: {
                        atproto: {
                            repo: {
                                listRecords: listRecordsMock,
                            },
                        },
                    },
                },
            } as unknown as BskyAgent;
            handlerAgent = new HandlerAgent(
                'agentName',
                testHandle,
                testPassword,
                mockedAgent
            );
        }
    });

    it('post should call post with input', async () => {
        const input = {
            text: 'Test post',
            reply: undefined,
        };
        await handlerAgent.post(input);
        expect(postMock).toHaveBeenCalledWith(input);
    });

    describe('CreateSkeet', () => {
        it('createSkeet should call post with input text and no reply if no skeetReply', async () => {
            await handlerAgent.createSkeet('Test post');
            expect(postMock).toHaveBeenCalledWith({ text: 'Test post' });
        });

        it('createSkeet should call post with input text and reply if existingPostDetails is present', async () => {
            const subject: Subject = SubjectFactory.make();
            const reply: Reply = ReplyFactory.factory()
                .parent(subject)
                .root(subject)
                .create();
            await handlerAgent.createSkeet('Test post', reply);
            expect(postMock).toHaveBeenCalledWith({
                text: 'Test post',
                reply: reply,
            });
        });
    });

    it('DeleteSkeet should call deletePost for given post', async () => {
        await handlerAgent.deleteSkeet('skeetURI');
        expect(deletePostMock).toHaveBeenCalledWith('skeetURI');
    });

    describe('Like', () => {
        it('likeSkeet should call like for given post', async () => {
            await handlerAgent.likeSkeet('skeetURI', 'skeetCID');
            expect(likeMock).toHaveBeenCalledWith('skeetURI', 'skeetCID');
        });

        it('unlikeSkeet should call deleteLike for given post', async () => {
            await handlerAgent.unlikeSkeet('skeetURI');
            expect(deleteLikeMock).toHaveBeenCalledWith('recordURI');
        });

        it('unlikeSkeet should not call deleteLike for given post', async () => {
            await handlerAgent.unlikeSkeet('nonSkeet');
            expect(deleteLikeMock).not.toHaveBeenCalled();
        });
    });

    describe('Reskeet', () => {
        it('reskeet should call repost for given post', async () => {
            await handlerAgent.reskeetSkeet('skeetURI', 'skeetCID');
            expect(repostMock).toHaveBeenCalledWith('skeetURI', 'skeetCID');
        });

        it('unreskeet should call deleteRepost for given post', async () => {
            // TODO update this test to mock the listRecords function
            await handlerAgent.unreskeetSkeet('skeetURI');
            expect(deleteRepostMock).toHaveBeenCalledWith('recordURI');
        });

        it('unreskeet should not call deleteRepost for given post', async () => {
            // TODO update this test to mock the listRecords function
            await handlerAgent.unreskeetSkeet('nonSkeet');
            expect(deleteRepostMock).not.toHaveBeenCalled();
        });

        it('unreskeet should not call deleteRepost for given post', async () => {
            listRecordsMock.mockReturnValue(undefined);
            const mockDebugError = jest.fn();
            DebugLog.error = mockDebugError;
            // TODO update this test to mock the listRecords function
            await handlerAgent.unreskeetSkeet('nonSkeet');
            expect(deleteRepostMock).not.toHaveBeenCalled();
            expect(mockDebugError).toHaveBeenCalledWith(
                'Handler Agent',
                'Failed to retrieve repost records'
            );
        });
    });
});
