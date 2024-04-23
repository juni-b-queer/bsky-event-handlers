# Handlers

## Abstract Message Handler
The abstract message handler is the class that all other message handlers are built on.
It accepts an array of `AbstractValidator`s and an array of `AbstractMessageAction`s, as well as the HandlerAgent to use.

It's handle function is called in the Jetstream subscription when it gets a new message for it's type (post,like,repost,follow (c/d))

handle will go through the Validators, and so long as every validator returns true, it will run the actions.


## Message Handler
Message handler is the basic one, it uses `JetstreamMessage` for validating and running actions, this can be used for post deletion and like/repost/follow creation and deletion for now
### Example
```typescript
new MessageHandler(
    [Validators],
    [Actions],
    handlerAgent
)
```


## CreateSkeetHandler
The `CreateSkeetHandler` extends the `AbstractMessageHandler` but is intended for use with only post creation messages, hence why when running validators and actions, it will cast the `JetstreamMessage` to a `CreateSkeetMessage` which has more well defined properties and attributes for post creation messages

### Example
```typescript
new CreateSkeetHandler(
    [Validators],
    [Actions],
    handlerAgent
)
```