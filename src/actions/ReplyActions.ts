import {BskyAgent, RichText} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {AbstractTriggerAction} from "./AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import {replyToPost} from "../utils/agent-post-utils";
import {sleep} from "../utils/private-utils";
import {AgentDetails} from "../types/AgentDetails";

export class ReplyWithInputAction extends AbstractTriggerAction {
    constructor(private replyText: string) {
        super();
    }
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        // @ts-ignore
        return await replyToPost(agentDetails.agent, postDetails, this.replyText);
    }
}

export class ReplyWithGeneratedTextAction extends AbstractTriggerAction {
    constructor(private replyGeneratorFunction: (agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails) => any) {
        super();
    }
    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails): Promise<any> {
        let responseText = this.replyGeneratorFunction(agentDetails, op, postDetails)
        // @ts-ignore
        return await replyToPost(agentDetails.agent, postDetails, responseText);
    }
}

export class ReplyRepetitivelyFromStringArray extends AbstractTriggerAction{
    constructor(private inputArray: string[]) {
        super();
    }

    async handle(agentDetails: AgentDetails, op: RepoOp, postDetails: PostDetails) {
        let lastPost = postDetails;
        for (const skeetText of this.inputArray) {
            // @ts-ignore
            lastPost = await this.replyWithNextPost(agentDetails.agent, lastPost, skeetText)
            await sleep(50)
        }
    }


    async replyWithNextPost(agent: BskyAgent, currentPost: PostDetails, replyTextInput: string): Promise<PostDetails> {
        const replyText = new RichText({
            text: replyTextInput,
        })

        let reply = {
            root: {
                cid: currentPost.cid,
                uri: currentPost.uri
            },
            parent: {
                cid: currentPost.cid,
                uri: currentPost.uri
            }
        }

        // @ts-ignore
        if(currentPost.value.reply){
            // @ts-ignore
            reply.root = currentPost.value.reply.root
        }

        let newPost = await agent.post({
            reply: reply,
            text: replyText.text
        });


        return {
            cid: newPost.cid,
            uri: newPost.uri,
            value: {
                reply: reply
            }
        }
    }
}