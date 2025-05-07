import {AtpAgent} from "@atproto/api";
import {mockDeep, notUndefined} from "jest-mock-extended";
import {HandlerAgent, JetstreamSubject} from "../../src";

describe('HandlerAgentDM', () => {
    const mockAtpAgent = mockDeep<AtpAgent>();
    Object.defineProperty(mockAtpAgent, 'session', { value: {
            did: 'did:plc:mockdid',
            handle: 'mockhandle.test',
            email: 'mock@example.com',
            emailConfirmed: true,
            accessJwt: 'mock-access-jwt',
            refreshJwt: 'mock-refresh-jwt'
        }, writable: false });
    let handlerAgent: HandlerAgent;

    const mockGetConvoForUserResp = {
        success: true,
        headers: {},
        data: {
            convo: {
                id: 'convoid',
                rev: '1234',
                members: [
                    {
                        did: 'did:plc:test',
                        handle: 'testhandle.handle'
                    },
                    {
                        did: 'did:plc:other',
                        handle: 'testhandle.other'
                    }
                ],
                lastMessage: {
                    $type: 'chat.bsky.convo.defs#messageView',
                    id: 'messageid',
                    rev: '5678',
                    sender: {
                        did: 'did:plc:test',
                    },
                    text: 'test message',
                }
            }
        }
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
    describe('getConvoForUser', () => {
        it('getConvoForUser gets convo for user', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getConvoForMembers.mockResolvedValue(mockGetConvoForUserResp)
            const resp = await handlerAgent.getConvoForUser('did:plc:test');

            expect(mockAtpAgent.chat.bsky.convo.getConvoForMembers).toHaveBeenCalledWith({
                members: [
                    'did:plc:test'
                ]
            })
            expect(resp).toMatchObject(mockGetConvoForUserResp.data.convo)
        })


    })

    describe('getConvoIdForUser', () => {
        it('getConvoIdForUser gets convo id', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getConvoForMembers.mockResolvedValue(mockGetConvoForUserResp)
            const resp = await handlerAgent.getConvoIdForUser('did:plc:test');

            expect(mockAtpAgent.chat.bsky.convo.getConvoForMembers).toHaveBeenCalledWith({
                members: [
                    'did:plc:test'
                ]
            })
            expect(resp).toBe(mockGetConvoForUserResp.data.convo.id)
        })


    })

    describe('getMessagesInConvo', () => {
        const getMessagesMockResp = {
            data:{
                cursor: '1243',
                messages: []
            }
        }
        it('getMessagesInConvo gets messages', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getMessages.mockResolvedValue(getMessagesMockResp)
            const resp = await handlerAgent.getMessagesInConvo('123');

            expect(mockAtpAgent.chat.bsky.convo.getMessages).toHaveBeenCalledWith({
                convoId: '123',
                cursor: undefined,
                limit: 100
            })
            expect(resp).toBe(getMessagesMockResp.data)
        })


    })

    describe('setMessageAsRead', () => {
        const setMessageAsReadResp = {
            data:{
                convo:{
                    id: '123'
                }
            },
            success: true,
        }
        it('setMessageAsRead sets a convo as read', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.updateRead.mockResolvedValue(setMessageAsReadResp)
            const resp = await handlerAgent.setMessageAsRead('123');

            expect(mockAtpAgent.chat.bsky.convo.updateRead).toHaveBeenCalledWith({
                convoId: '123',
                messageId: undefined
            })
            expect(resp).toBe(setMessageAsReadResp.data)
        })

        it('setMessageAsRead sets a message as read', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.updateRead.mockResolvedValue(setMessageAsReadResp)
            const resp = await handlerAgent.setMessageAsRead('123', '456');

            expect(mockAtpAgent.chat.bsky.convo.updateRead).toHaveBeenCalledWith({
                convoId: '123',
                messageId: '456'
            })
            expect(resp).toBe(setMessageAsReadResp.data)
        })
    })

    describe('reactToMessage', () => {
        const reactToMessageResp = {
            data:{
                message: {
                    id: '5678'
                }
            },
            success: true,
        }
        it('reactToMessage sets a reaction on a message', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.addReaction.mockResolvedValue(reactToMessageResp)
            const resp = await handlerAgent.reactToMessage('123', '456', '❤️');

            expect(mockAtpAgent.chat.bsky.convo.addReaction).toHaveBeenCalledWith({
                convoId: '123',
                messageId: '456',
                value: '❤️'
            })
            expect(resp).toBe(reactToMessageResp.data)
        })
    })

    describe('getCanDmUser', () => {
        const getCanDmUserResp = {
            data:{
                canChat: true,
                convo: {
                    id: '123'
                }
            },
            success: true,
        }
        it('getCanDmUser sets a reaction on a message', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getConvoAvailability.mockResolvedValue(getCanDmUserResp)
            const resp = await handlerAgent.getCanDmUser('did:plc:example');

            expect(mockAtpAgent.chat.bsky.convo.getConvoAvailability).toHaveBeenCalledWith({
                members: ['did:plc:example']
            })
            expect(resp).toBe(getCanDmUserResp.data)
        })
    })

    describe('sendMessageToUser', () => {

        it('sendMessageToUser gets convo id and sends message', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getConvoForMembers.mockResolvedValue(mockGetConvoForUserResp)

            const messageText = 'hello world'
            await handlerAgent.sendMessageToUser('did:plc:test', messageText);

            expect(mockAtpAgent.chat.bsky.convo.getConvoForMembers).toHaveBeenCalledWith({
                members: [
                    'did:plc:test'
                ]
            })
            expect(mockAtpAgent.chat.bsky.convo.sendMessage).toHaveBeenCalledWith({
                convoId: mockGetConvoForUserResp.data.convo.id,
                message: {
                    text: messageText
                }
            })
        })

        it('sendMessageToUser gets convo id and sends message with embed', async () => {
            // @ts-ignore
            mockAtpAgent.chat.bsky.convo.getConvoForMembers.mockResolvedValue(mockGetConvoForUserResp)

            const messageText = 'hello world'
            const embedSubject: JetstreamSubject = {
                cid: 'examplecid',
                uri: 'at//did:plc:example/app.bsky.feed.post/rkey',
            }
            await handlerAgent.sendMessageToUser('did:plc:test', messageText, embedSubject);

            expect(mockAtpAgent.chat.bsky.convo.getConvoForMembers).toHaveBeenCalledWith({
                members: [
                    'did:plc:test'
                ]
            })
            expect(mockAtpAgent.chat.bsky.convo.sendMessage).toHaveBeenCalledWith({
                convoId: mockGetConvoForUserResp.data.convo.id,
                message: {
                    text: messageText,
                    embed: {
                        $type: 'app.bsky.embed.record',
                        record: embedSubject,
                    }
                }
            })
        })


    })
})