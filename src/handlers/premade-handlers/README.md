# Premade Handlers

## Good Bot Handler

Use this handler in the post creation handlers array to make the bot respond when someone thanks it, or tells it that it's good

By default, it will respond "Thank you 🥹", but f you want to give it a custom response, pass the response string into the second parameter
To use it
`GoodBotHandler.make(handlerAgent, "reponse")`

## Bad Bot Handler

Just like the GoodBotHandler, the BadBotHandler will respond when someone tells it that its bad

By default, it will respond "I'm sorry 😓", but passing a string into the second parameter will use that string as the response
To use it
`BadBotHandler.make(handlerAgent, "reponse")`

## Offline Handler

The offline handler is more for command based bots, so it can be put up while a bot is undergoing maintenance

The first parameter, like the other premade handlers, is the handlerAgent
The second is the command it will be watching for (!command and command!)
And the third is what the response will be if someone uses the command

`OfflineHandler.make(handlerAgent, "command", "response")`

## Creating a reusable handler

A handler needs validators, actions, and an agent. Creating your own handler makes it easier to reuse them. The Good/Bad bot handlers are premade and ready to use.

Your handler must extend AbstractMessageHandler or for handlers to only handle CreateSkeetMessages, extend CreateSkeetHandler.

The below example simply takes in the handlerAgent, but has the validators and actions set automatically in the constructor

```typescript
export class ExampleHandler extends CreateSkeetHandler {
    constructor(public handlerAgent: HandlerAgent) {
        super(
            [InputEqualsValidator.make('Hello')],
            [ReplyToSkeetAction.make('World!')],
            handlerAgent
        );
    }

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}
```

To use this handler, you'll just use `ExampleHandler.make(handlerAgent)` in your handlers object

```typescript
let handlers = {
    post: {
        c: [ExampleHandler.make(handlerAgent)],
    },
};
```
