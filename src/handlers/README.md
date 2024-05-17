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
MessageHandler.make([Validators], [Actions], handlerAgent);
```

## CreateSkeetHandler

The `CreateSkeetHandler` extends the `AbstractMessageHandler` but is intended for use with only post creation messages, hence why when running validators and actions, it will cast the `JetstreamMessage` to a `CreateSkeetMessage` which has more well defined properties and attributes for post creation messages

### Example

```typescript
CreateSkeetHandler.make([Validators], [Actions], handlerAgent);
```

## Handlers as actions

Actions are called in the handler with the action's `handle` function, but handlers are run with their own `handle` function. This means that we can pass Handlers as actions to nest our actions.

### Simple example:

This example handler first checks if the reply is to the bot agent, and not posted by the bot user.
If so, it runs the next two handlers. The first will reply "down" if the reply text equals "up", and the second will reply "up" if the text is "down"

```typescript
CreateSkeetHandler.make(
    [
        ReplyingToBotValidator.make(),
        PostedByUserValidator.make(handlerAgent.getDid).not(),
    ],
    [
        CreateSkeetHandler.make(
            [InputEqualsValidator.make('up')],
            [ReplyToSkeetAction.make('down')]
        ),
        CreateSkeetHandler.make(
            [InputEqualsValidator.make('down')],
            [ReplyToSkeetAction.make('up')]
        ),
    ],
    handlerAgent
);
```

