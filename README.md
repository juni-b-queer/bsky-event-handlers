# Bluesky Event Handlers

An easy package to use for making bluesky bots with validators and handler actions

# Table of contents

- [Quickstart](#quickstart)
- [Overview](#overview)
- [Agent](./src/agent/README.md)
- [Validators](./src/validations/README.md)
- [Actions](./src/actions/README.md)
- [Pre-made Handlers](./src/handlers/premade-handlers/README.md)
- [Handlers](./src/handlers/README.md)
- [Handler Controller](./src/handlers/README.md)
- [Firehose Subscription](./src/firehose/README.md)
- [Utility Functions](./src/util/README.md)
- [Types](./src/types/README.md)
- [Credits](#credits)

[npm Package](https://www.npmjs.com/package/bsky-event-handlers)

# Quickstart

This guide is assuming you're using BunJS

Install the package
`bun install --save bsky-event-handlers`

Then, in your `index.ts` you'll need a few things

Create your bsky agent

### Todo - change the readme to reflect the new setup

```typescript
let agentDetails: AgentDetails = {
  name: "test-bot",
  did: undefined,
  handle: <string>Bun.env.TEST_BSKY_HANDLE,
  password: <string>Bun.env.TEST_BSKY_PASSWORD,
  sessionData: undefined,
  agent: undefined,
};
// This function is required! It sets up your bluesky agent
agentDetails = createAgent(agentDetails);
```

Create a simple Handler

```typescript
let handler = new PostHandler(
  [new InputStartsWithValidator("Hello!")],
  [new ReplyWithInputAction("Hi!")],
  true,
);
```

To set up your handler controllers

```typescript
let handlerController: HandlerController;
```

Then to initialize the agent and handlers

```typescript
async function initialize() {
  // This function is required! It authenticates your bluesky agent
  agentDetails = await authenticateAgent(agentDetails);

  handlerController = new HandlerController(
    agentDetails,
    [
      // Handlers can also be created in other files and imported
      handler,
    ],
    true,
  );
  debugLog("INIT", "Initialized!");
}

try {
  await initialize();
} catch (e) {
  setTimeout(async function () {
    await initialize();
  }, 30000);
}
```

Then to start your firehose connection

```typescript
const firehoseSubscription = new FirehoseSubscription([handlerController], 150);
```

All together, a simple bot index.ts would look like

```typescript
import {
  HandlerController,
  AgentDetails,
  PostDetails,
  PostHandler,
  replyToPost,
  authenticateAgent,
  createAgent,
  debugLog,
  FirehoseSubscription,
  InputStartsWithValidator,
  ReplyWithInputAction,
} from "bsky-event-handlers";

// Agent details
let agentDetails: AgentDetails = {
  name: "test-bot",
  did: undefined,
  handle: <string>Bun.env.TEST_BSKY_HANDLE,
  password: <string>Bun.env.TEST_BSKY_PASSWORD,
  sessionData: undefined,
  agent: undefined,
};
agentDetails = createAgent(agentDetails);

let handler = new PostHandler(
  [new InputStartsWithValidator("Hello!")],
  [new ReplyWithInputAction("Hi!")],
  true,
);

//Create Handler controller
let handlerController: HandlerController;

// Initialize the agent and handler
async function initialize() {
  agentDetails = await authenticateAgent(agentDetails);

  handlerController = new HandlerController(agentDetails, [handler], true);

  debugLog("INIT", "Initialized!");
}

try {
  await initialize();
} catch (e) {
  setTimeout(async function () {
    await initialize();
  }, 30000);
}

/**
 * The firehose subscription
 */
const firehoseSubscription = new FirehoseSubscription([handlerController], 150);
```

For full example code, see my [Test firehose bot](https://github.com/juni-b-queer/test-firehose-bot)

# Overview

I wrote this package because I wanted a simple and quick way to get firehose bluesky bots up and running.
Bluesky Event Handlers is a powerful, adaptable package developed for creating bots within the Bluesky ecosystem. The package offers a wide array of inbuilt validators and action handlers to facilitate the creation of event-driven bot actions- all of which contribute to smoother, faster, and more efficient bot development.

The package internally uses the Bluesky Agent to interact with the Bluesky network. The flexibility provided by the AbstractValidator and AbstractTriggerAction base classes, paves the way for easy extension and creation of custom validators and actions to suit your specific requirements.

By leveraging the combination of Validators and Actions, you can create a unique sequence of automatic responses for your bot in response to defined triggers, enhancing your bot's interactivity, flexibility and efficiency.

# Credits

## Packages used

- [atproto-firehose](https://www.npmjs.com/package/atproto-firehose)
- [@atproto/api](https://www.npmjs.com/package/@atproto/api)
