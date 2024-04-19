# Handlers

## Post handlers

The `PostHandler` class extends the AbstractPayloadHandler and is used to handle a post event. It takes in an array of validators and actions to execute if the validators pass. Validators are run sequentially and if all pass, it will execute the actions.

The `PostHandler`'s `requireFollowing` parameter when set to `true`, makes the handler only respond to posts from users that follow the bot.

Use the `setFollowers` method to provide a list of users the bot is following.

```typescript //Import required classes import { PostHandler, InputStartsWithValidator, ReplyWithInputAction } from "bsky-event-handlers";
//Create validators
let validators = [new InputStartsWithValidator("Hello")];
//Define the actions to be taken
let actions = [new ReplyWithInputAction("Hello there!")];
//Create a PostHandler instance with validators, actions and the requirement that posters must be followed by the bot
let postHandler = new PostHandler(validators, actions, true);
//Set the list of followers, replace 'did:user:123' with actual followers
// (This step is handled with the HandlerController)
postHandler.setFollowers(["did:user:123"]);
```

### Example

This is a simple handler that uses the predefined validators and actions.

When a post Starts with "Hello world!", the bot will reply with "Hi!". The boolean at the end is to indicate that
the bot will only reply to it's followers. When set to false, it will respond to anyone on the network.

```typescript
import {
  InputStartsWithValidator,
  ReplyWithInputAction,
  PostHandler,
} from "bsky-event-handlers";

export let TestHandler = new PostHandler(
  [new InputStartsWithValidator("Hello world!")],
  [new ReplyWithInputAction("Hi!")],
  true,
);
```

# Handler Controller

The `HandlerController` class takes in an `AgentDetails` object, a list of handlers (which could be of any class that extends `AbstractPayloadHandler`), and a boolean to specify if the bot should only reply to users its following.

The `HandlerController` is responsible for refreshing follower lists, and distributing operations to each handler. Refreshing followers, enables the `PostHandler` objects to know who the bot is currently following, ensuring the bot only reacts to posts from following users if specified.

Here's an example of how to use it:

```typescript
// Import required classes
import {
  PostHandler,
  InputStartsWithValidator,
  ReplyWithInputAction,
  AgentDetails,
  HandlerController,
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
```