import {getPosterDID, PostDetails} from "../../src";


describe("Get Post DID", () => {
    test("Get DID from post details", () => {
        let postDetails: PostDetails = {
            cid: "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424",
            uri: "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n",
            value: {"cid": "bafyreie5jatwgcuea74lxk7v5hxepvlmwbuihbb4qval23hhuohqae3424", "uri": "at://did:plc:wpp4lklhvmopw6zcy6qb42ru/app.bsky.feed.post/3kgf6hi5bco2n", "value": {"text": "TestRemindMe! 2 hours", "$type": "app.bsky.feed.post", "langs": ["en"], "reply": {"root": {"cid": "bafyreicxky6wzygxjrlglugqlatt25rkz5h35qqbiarugfuw2lmsgegf5q", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kdmsue53gs2m"}, "parent": {"cid": "bafyreibxmqw44tlmkyy43sdyu3d764los3xonzgk4qngkcceja2pgtp6ka", "uri": "at://did:plc:2bnsooklzchcu5ao7xdjosrs/app.bsky.feed.post/3kgf47lws352a"}}, "createdAt": "2023-12-13T00:18:22.475Z"}}
        }
        let expected = "did:plc:wpp4lklhvmopw6zcy6qb42ru";
        expect(getPosterDID(postDetails)).toBe(expected);
    });

});
