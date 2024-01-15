Todo
- Finish Readme
- Add the use of the firehose into this package

# Bluesky Event Handlers
[npm Package](https://www.npmjs.com/package/bsky-event-handlers)

# Quickstart
This guide is assuming you're using BunJS

`bun install --save bsky-event-handlers`

In your `index.ts` you'll need a few things

To create your bsky agent
```typescript
let agentDetails: AgentDetails = {
    name: "test-bot",
    did: undefined,
    handle: <string>Bun.env.TEST_BSKY_HANDLE,
    password: <string>Bun.env.TEST_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
testAgentDetails = createAgent(testAgentDetails)
```

To set up your handler controllers
```typescript
let handlerController: HandlerController;
```

Then to initialize the agent and handlers
```typescript
async function initialize() {
    agentDetails = await authenticateAgent(agentDetails)

    handlerController = new HandlerController(agentDetails, [
        // Assuming you've created your handler in another file and imported it
        TestHandler
    ], true)
    debugLog("INIT", 'Initialized!')
}

try {
    await initialize();
} catch (e) {
    setTimeout(async function () {
        await initialize()
    }, 30000)
}
```

Then to start your firehose connection
```typescript
const firehoseSubscription = new FirehoseSubscription([testHandlerController], 150);
```


All together, a simple bot index.ts would look like
```typescript
import {
    HandlerController,
    AgentDetails,
    PostDetails,
    replyToPost,
    authenticateAgent,
    createAgent,
    debugLog,
    FirehoseSubscription
} from "bsky-event-handlers";
import {TestHandler} from "./TestHandler.ts";

// Agent details
let testAgentDetails: AgentDetails = {
    name: "test-bot",
    did: undefined,
    handle: <string>Bun.env.TEST_BSKY_HANDLE,
    password: <string>Bun.env.TEST_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
testAgentDetails = createAgent(testAgentDetails)

//Create Handler controller
let testHandlerController: HandlerController;

// Initialize the agent and handler
async function initialize() {
    testAgentDetails = await authenticateAgent(testAgentDetails)

    testHandlerController = new HandlerController(testAgentDetails, [
        TestHandler
    ], true)

    debugLog("INIT", 'Initialized!')
}

try {
    await initialize();
} catch (e) {
    setTimeout(async function () {
        await initialize()
    }, 30000)
}


/**
 * The firehose subscription
 */
const firehoseSubscription = new FirehoseSubscription([testHandlerController], 150);
```

For full example code, see my [Test firehose bot](https://github.com/juni-b-queer/test-firehose-bot)

# Overview

# Validators

# Actions

# Handlers

# Credits
## Packages used
- [atproto-firehose](https://www.npmjs.com/package/atproto-firehose)
- [@atproto/api](https://www.npmjs.com/package/@atproto/api)
