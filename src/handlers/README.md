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
new MessageHandler([Validators], [Actions], handlerAgent);
```

## CreateSkeetHandler

The `CreateSkeetHandler` extends the `AbstractMessageHandler` but is intended for use with only post creation messages, hence why when running validators and actions, it will cast the `JetstreamMessage` to a `CreateSkeetMessage` which has more well defined properties and attributes for post creation messages

### Example

```typescript
new CreateSkeetHandler([Validators], [Actions], handlerAgent);
```


## Creating a reusable handler

A handler needs validators, actions, and an agent. Creating your own handler makes it easier to reuse them. The Good/Bad bot handlers are premade and ready to use.

Your handler must extend AbstractMessageHandler or for handlers to only handle CreateSkeetMessages, extend CreateSkeetHandler.

The below example simply takes in the handlerAgent, but has the validators and actions set automatically in the constructor
```typescript
export class ExampleHandler extends CreateSkeetHandler {
  constructor(
    public handlerAgent: HandlerAgent,
  ) {
    super(
      [new InputEqualsValidator("Hello")],
      [new ReplyToSkeetAction("World!")],
      handlerAgent,
    );
  }

  async handle(message: CreateSkeetMessage): Promise<void> {
    return super.handle(message);
  }
}
```

To use this handler, you'll just use `new ExampleHandler(handlerAgent)` in your handlers object
```typescript
let handlers = {
  post: {
    c: [
      new ExampleHandler(handlerAgent)
    ]
  }
}
```
