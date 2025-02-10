# Standard Actions

Actions are the set of operations that are executed in response to certain validation or criteria fulfillment. This could range from sending reply posts, logging particular information, or executing any function, to more complex sequences of operations. You even have the ability to create custom actions based on your needs.

These are standardized actions that make them easy to use from any subscriber or handler.
## Provided Actions

-   [Skeet Actions](#skeet-actions)
    -   [CreateSkeetAction](#createskeetaction)
    -   [DeleteSkeetAction](#deleteskeetaction)
-   [Follow Actions](#follow-actions)
    -   [CreateFollowAction](#createfollowaction)
    -   [DeleteFollowAction](#deletefollowaction)
-   [Like Actions](#like-actions)
    -   [CreateLikeAction](#createlikeaction)
    -   [DeleteLikeAction](#deletelikeaction)
-   [Reskeet Actions](#reskeet-actions)
    -   [CreateReskeetAction](#createreskeetaction)
    -   [DeleteReskeetAction](#deletereskeetaction)

## Skeet Actions

### CreateSkeetAction

Create a skeet. Accepts a string or function that returns a string to be used as the post text.

An optional second argument can be passed in to make it a reply. A helper function `MessageHandler.generateReplyFromMessage` can be used to automatically generate the reply for a given message.

```
CreateSkeetAction.make((handler: HandlerAgent, event: JetstreamEventCommit): string =>{
     return "hello!";
 },
     MessageHandler.generateReplyFromMessage)
```

An optional third argument can be passed in to make it a quoteskeet.

```
CreateSkeetAction.make("Quote", MessageHandler.generateReplyFromMessage, (handler: HandlerAgent, event: JetstreamEventCommit): JetstreamSubject =>{
    return {
        cid: 'cid',
        uri: 'uri'
    }
})
```

### DeleteSkeetAction

Deletes a given skeet. Accepts a string or function that returns a string that should be the uri of the skeet to delete

`DeleteSkeetAction.make('skeetUri')`

## Follow Actions

### CreateFollowAction

Follow a user. Accepts a string or function that returns a string that should be the did of the user to follow
`CreateFollowAction.make('userDid')`

### DeleteFollowAction

Unfollow a user. Accepts a string or function that returns a string that should be the did of the user to unfollow
`DeleteFollowAction.make('userDid')`

## Like Actions

### CreateLikeAction

Like a given post, accepts a function or string for the URI and CID of the post to like.

Helper functions `MessageHandler.getUriFromMessage` and `MessageHandler.getCidFromMessage` are provided to like a post from a given Jetstream event

`CreateLikeAction.make(MessageHandler.getUriFromMessage, MessageHandler.getCidFromMessage)`

### DeleteLikeAction

Unlikes a given post. Accepts a function or string for the URI of the post to unlike

`DeleteLikeAction.make(MessageHandler.getUriFromMessage)`


## Reskeet Actions

### CreateReskeetAction

Reskeet a given post, accepts a function or string for the URI and CID of the post to like.

Helper functions `MessageHandler.getUriFromMessage` and `MessageHandler.getCidFromMessage` are provided to reskeet a post from a given Jetstream event

`CreateReskeetAction.make(MessageHandler.getUriFromMessage, MessageHandler.getCidFromMessage)`

### DeleteReskeetAction

Unreskeets a given post. Accepts a function or string for the URI of the post to unreskeet

`DeleteReskeetAction.make(MessageHandler.getUriFromMessage)`

