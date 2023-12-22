import {AtpSessionData, BskyAgent} from "@atproto/api";


export type AgentDetails = {
    name: string,
    handle: string,
    password: string,
    did: string | undefined,
    sessionData: AtpSessionData | undefined,
    agent: BskyAgent | undefined
}