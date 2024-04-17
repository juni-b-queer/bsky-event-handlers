import {AtpSessionData, AtpSessionEvent, BskyAgent} from "@atproto/api";

// Mock any instance methods like this
export const agentLoginMock = jest.fn()
// export const agentLoginMock = jest.fn((opts: {
//     identifier: string,
//     password: string,
// }) => {
// return Promise.resolve({})
// });

export const agentPostMock = jest.fn();
export const agentGetPostMock = jest.fn();
export const agentResumeSessionMock = jest.fn();


export const generateBskyAgentMock = () =>
    jest.fn().mockImplementation(() => ({
        login: agentLoginMock,
        post: agentPostMock,
        getPost: agentGetPostMock,
        resumeSession: agentResumeSessionMock,
    }));
