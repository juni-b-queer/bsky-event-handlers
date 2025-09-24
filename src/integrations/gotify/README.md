# Gotify Integration

[Gotify](https://gotify.net/) is a self-hosted notification service. \
I've added this client and a few actions because I want to get notified when something goes wrong with one of my bots. \
In order to use this integration, you need to have a self-hosted Gotify instance that is accessible to the bot, whether that is on the internet, or running locally. 

To use the gotify client, you'll need two environment variables: \
`GOTIFY_URL` - the URL of your Gotify instance \
`GOTIFY_TOKEN` - the API token for the Gotify application you want to send messages from

Instantiate the client with 
```typescript
const gotifyClient = new GotifyClient(
    process.env.GOTIFY_URL,
    process.env.GOTIFY_TOKEN
);
```

And send a message with 
```typescript
gotifyClient.sendMessage("Message Title", "Hello World! this is a message");
```

## Gotify Client
### Functions
- `sendMessage(title: string, message: string, priority: number = 1)` - sends a message to the Gotify instance

## Gotify Actions
TODO
