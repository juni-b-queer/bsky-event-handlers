import {BskyAgent, RichText} from "@atproto/api";
import {RepoOp} from "@atproto/api/dist/client/types/com/atproto/sync/subscribeRepos";
import {AbstractTriggerAction} from "./AbstractTriggerAction";
import {PostDetails} from "../types/PostDetails";
import {replyToPost} from "../utils/agent-post-utils";
import {sleep} from "../utils/private-utils";

export class ReplyWithInputAction extends AbstractTriggerAction {
    constructor(private replyText: string) {
        super();
    }
    async handle(agent: BskyAgent, op: RepoOp, postDetails: PostDetails): Promise<any> {
        return await replyToPost(agent, postDetails, this.replyText);
    }
}

export class ReplyWithGeneratedTextAction extends AbstractTriggerAction {
    constructor(private replyGeneratorFunction: () => any) {
        super();
    }
    async handle(agent: BskyAgent, op: RepoOp, postDetails: PostDetails): Promise<any> {
        let responseText = this.replyGeneratorFunction()
        return await replyToPost(agent, postDetails, responseText);
    }
}

export class ReplyRepetitivelyFromStringArray extends AbstractTriggerAction{
    constructor(private inputArray: any) {
        super();
    }

    async handle(agent: BskyAgent, op: RepoOp, postDetails: PostDetails) {
        let lastPost = postDetails;
        for (const skeetText of this.inputArray) {
            lastPost = await this.replyWithNextPost(agent, lastPost, skeetText)
            console.log(lastPost)
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