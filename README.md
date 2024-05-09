# bsky-event-handlers


An easy package to use for making bluesky bots with validators and handler actions

[![GitHub Actions Test Status](https://img.shields.io/github/actions/workflow/status/juni-b-queer/bsky-event-handlers/testandlint.yml?logo=github&label=Tests)](https://github.com/juni-b-queer/bsky-event-handlers/actions/workflows/testandlint.yml?query=branch%3Amain)
[![GitHub Actions Publish Status](https://img.shields.io/github/actions/workflow/status/juni-b-queer/bsky-event-handlers/semanticversionpublish.yml?logo=github&label=Publish)](https://github.com/juni-b-queer/bsky-event-handlers/actions/workflows/semanticversionpublish.yml?query=branch%3Amain)
[![Codecov](https://img.shields.io/codecov/c/github/juni-b-queer/bsky-event-handlers.svg?logo=codecov)](https://app.codecov.io/gh/juni-b-queer/bsky-event-handlers)
[![npm version](https://img.shields.io/npm/dw/bsky-event-handlers?logo=npm)](https://www.npmjs.com/package/bsky-event-handlers)

[![github release](https://img.shields.io/github/v/release/juni-b-queer/bsky-event-handlers?logo=github&label=main)](https://github.com/juni-b-queer/bsky-event-handlers/releases/latest)
[![github beta release](https://img.shields.io/github/v/release/juni-b-queer/bsky-event-handlers?include_prereleases&logo=github&label=beta)](https://github.com/juni-b-queer/bsky-event-handlers/releases/latest)

Scaffold a new project with this package using: \
[![create-bsky-bot](https://img.shields.io/badge/create--bsky--bot-white.svg?logo=npm&color=blue)](https://www.npmjs.com/package/create-bsky-bot)
# Table of contents

**There is a lot of work left to be done for likes, reskeets, and follows, but is mostly complete for handling new
skeets**

- [Quickstart](#quickstart)
- [Overview](#overview)
- [Agent](./src/agent/README.md)
- [Validators](./src/validations/README.md)
- [Actions](./src/actions/README.md)
- [Handlers](./src/handlers/README.md)
    - [Record Handlers](./src/handlers/README.md)
    - [Pre-made Handlers](./src/handlers/premade-handlers/README.md)
- [Jetsteam Firehose Subscription](./src/firehose/README.md)
- [Utility Functions](./src/utils/README.md)
- [Jetstream Types](./src/types/README.md)
- [Credits](#credits)

[npm Package](https://www.npmjs.com/package/bsky-event-handlers)

# Quickstart

## Scaffold project with [create-bsky-bot](https://github.com/juni-b-queer/create-bsky-bot)

Run `bunx create-bsky-bot {name}` to scaffold the project with jetstream and docker files all ready for you

Enter the new directory

Copy the .env.example into a new .env and fill in the handle and password

Start building!

To run it, run `make up`. This will build your bot into a container and run it, along with a jetstream container.

## Getting it running on your own

This guide is assuming you're using BunJS

Install the package
`bun install --save bsky-event-handlers`

Then, in your `index.ts` you'll need a few things

Create your bsky agent and prepare your jetstreamSubscription variable

```typescript
const testAgent = new HandlerAgent(
  'test-bot',
  <string>Bun.env.TEST_BSKY_HANDLE,
  <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;
```

Initialize your handlers

```typescript
const handlers: JetstreamSubscriptionHandlers = {
  post: {
    c: [
      new CreateSkeetHandler(
        [new InputEqualsValidator('Hello')],
        [new ReplyToSkeetAction('World!')],
        testAgent
      ),
    ],
    d: [],
  },
  like: {
    c: [],
    d: [],
  },
  follow: {
    c: [],
    d: [],
  },
  repost: {
    c: [],
    d: [],
  },
};
```

If you're not acting on the creation/deletion of either of the four options, you can exclude them from this object

for our example, we'll only be acting upon post creations, so our handlers will look like

```typescript
const handlers: JetstreamSubscriptionHandlers = {
  post: {
    c: [
      new CreateSkeetHandler(
        [new InputEqualsValidator('Hello')],
        [new ReplyToSkeetAction('World!')],
        testAgent
      ),
    ],
  },
};
```

By excluding the others, the Jetstream subscription will automatically update it's subscription url to query for only
post events.

Then in out `initialize` function, we authenticate the agent, and create the JetstreamSubscription object

```typescript
async function initialize() {
  await testAgent.authenticate();
  DebugLog.info('INIT', 'Initialized!');

  jetstreamSubscription = new JetstreamSubscription(
    handlers,
    <string>Bun.env.JETSTREAM_URL
  );
}
```

Then finally, we call initialize, then start the subscription to listen for events

```typescript
initialize().then(() => {
  jetstreamSubscription.createSubscription();
});
```

All together, a simple bot index.ts would look like

```typescript
import {
  HandlerAgent,
  JetstreamSubscriptionHandlers,
  JetstreamSubscription,
  CreateSkeetHandler,
  InputEqualsValidator,
  ReplyToSkeetAction,
  DebugLog,
} from 'bsky-event-handlers';

const testAgent = new HandlerAgent(
  'test-bot',
  <string>Bun.env.TEST_BSKY_HANDLE,
  <string>Bun.env.TEST_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

const handlers: JetstreamSubscriptionHandlers = {
  post: {
    c: [
      new CreateSkeetHandler(
        [new InputEqualsValidator('Hello')],
        [new ReplyToSkeetAction('World!')],
        testAgent
      ),
    ],
  },
};

async function initialize() {
  await testAgent.authenticate();
  DebugLog.info('INIT', 'Initialized!');

  jetstreamSubscription = new JetstreamSubscription(
    handlers,
    <string>Bun.env.JETSTREAM_URL
  );
}

initialize().then(() => {
  jetstreamSubscription.createSubscription();
});
```

A simple hello world bot is only 44 lines of code, and that's including the import!

For full example code with Jetstream setup and docker usage, see
my [Test firehose bot](https://github.com/juni-b-queer/test-firehose-bot)

### Env requirements

Your .env should look something like this

```.env
TEST_BSKY_HANDLE=handle.bsky.social
TEST_BSKY_PASSWORD=app-pass-word
DEBUG_LOG_ACTIVE=true #This will enable DebugLog
DEBUG_LOG_LEVEL=info # This sets the minimum log level that will be output
JETSTREAM_URL='ws://localhost:6008/subscribe'
```

# Overview

I wrote this package because I wanted a simple and quick way to get firehose bluesky bots up and running.
Bluesky Event Handlers is a powerful, adaptable package developed for creating bots within the Bluesky ecosystem. The
package offers a wide array of inbuilt validators and action handlers to facilitate the creation of event-driven bot
actions- all of which contribute to smoother, faster, and more efficient bot development.

The package internally uses the Bluesky Agent to interact with the Bluesky network. The flexibility provided by the
AbstractValidator and AbstractMessageAction base classes, paves the way for easy extension and creation of custom
validators and actions to suit your specific requirements.

By leveraging the combination of Validators and Actions, you can create a unique sequence of automatic responses for
your bot in response to defined triggers, enhancing your bot's interactivity, flexibility and efficiency.

# Credits

<a href="https://bsky.app/profile/did:plc:wpp4lklhvmopw6zcy6qb42ru">
		<img src="https://img.shields.io/badge/Juni_on_Bluesky-white.svg?logo=bluesky">
	</a>

## Packages/dependencies used

- [@atproto/api](https://www.npmjs.com/package/@atproto/api)
- [Jetstream](https://github.com/ericvolp12/jetstream) (Though I use
  a [forked version](https://github.com/juni-b-queer/jetstream) to include the CID and build/publish the docker
  container)
