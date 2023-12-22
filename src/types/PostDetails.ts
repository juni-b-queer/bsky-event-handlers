import {AppBskyFeedPost} from "@atproto/api";

export type PostDetails = {
    uri: string,
    cid: string,
    value: AppBskyFeedPost.Record | object
}