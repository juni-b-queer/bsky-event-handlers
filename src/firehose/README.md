# Firehose Subscription

The `FirehoseSubscription` class sets up a subscription to the Bluesky event firehose. It allows the bot to receive real-time post updates pushed directly from the firehose.

The `FirehoseSubscription` takes in an array of `HandlerControllers`, which define how to process the received repository operations. It filters the received operations into two types: those that reply to posts and those that do not, and hands them off to the corresponding `HandlerControllers` accordingly.

If the firehose stops sending updates for any reason, the `FirehoseSubscription` has a built-in mechanism to check for that and restart the subscription as needed.

Here's an example of how to use it:

```typescript
// Import required classes
import {
  PostHandler,
  InputStartsWithValidator,
  ReplyWithInputAction,
  AgentDetails,
  HandlerController,
  FirehoseSubscription,
} from "bsky-event-handlers";
// Define Agent Details
let agentDetails: AgentDetails = {}; // add the required agent details here
// Create Validators
let validators = [new InputStartsWithValidator("Hello!")];
// Define Actions
let actions = [new ReplyWithInputAction("Hi!")];
// Create Handler
let handler = new PostHandler(validators, actions, true);
// Create Handler Controller
let handlerController = new HandlerController(agentDetails, [handler]);
//Create Firehose Subscription
let firehoseSubscription = new FirehoseSubscription([handlerController], 150);
```

The code above will continuously listen for posts that start with "Hello!" and reply with "Hi!"
