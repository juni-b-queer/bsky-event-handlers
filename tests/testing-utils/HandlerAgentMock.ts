import { AtpSessionData, AtpSessionEvent, BskyAgent } from "@atproto/api";
import { HandlerAgent } from '../../src';

// mock all functions of the class, adjust return types and parameters for your real scenarios.
export const initializeBskyAgentMock = jest.fn<BskyAgent, []>(() => ({} as BskyAgent));
export const persistSessionMock = jest.fn<void, [AtpSessionEvent, AtpSessionData | undefined]>();
export const authenticateMock = jest.fn<Promise<HandlerAgent>, []>(() => Promise.resolve(new HandlerAgent('','', '', {} as BskyAgent)));

// Use this to get a mock instance
export const createMockedHandlerAgent = (): jest.Mocked<HandlerAgent> => ({
    initializeBskyAgent: initializeBskyAgentMock,
    persistSession: persistSessionMock,
    authenticate: authenticateMock
} as unknown as jest.Mocked<HandlerAgent>);