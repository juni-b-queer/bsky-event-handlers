# Premade Handlers

## Good Bot Handler

Use this handler in the post creation handlers array to make the bot respond when someone thanks it, or tells it that it's good

By default, it will respond "Thank you 🥹", but f you want to give it a custom response, pass the response string into the second parameter
To use it
`new GoodBotHandler(handlerAgent, "reponse")`

## Bad Bot Handler

Just like the GoodBotHandler, the BadBotHandler will respond when someone tells it that its bad

By default, it will respond "I'm sorry 😓", but passing a string into the second parameter will use that string as the response
To use it
`new BadBotHandler(handlerAgent, "reponse")`

## Offline Handler

The offline handler is more for command based bots, so it can be put up while a bot is undergoing maintenance

The first parameter, like the other premade handlers, is the handlerAgent
The second is the command it will be watching for (!command and command!)
And the third is what the response will be if someone uses the command

`new OfflineHandler(handlerAgent, "command", "response")`
