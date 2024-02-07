# Bluesky Event Handlers
An easy package to use for making bluesky bots with validators and handler actions

# Table of contents
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Validators](#validators)
- [Actions](#actions)
- [Handlers](#handlers)
- [Handler Controller](#handler-controller)
- [Firehose Subscription](#firehose-subscription)
- [Credits](#credits)

[npm Package](https://www.npmjs.com/package/bsky-event-handlers)
# Quickstart
This guide is assuming you're using BunJS

Install the package
`bun install --save bsky-event-handlers`

Then, in your `index.ts` you'll need a few things

Create your bsky agent
```typescript
let agentDetails: AgentDetails = {
    name: "test-bot",
    did: undefined,
    handle: <string>Bun.env.TEST_BSKY_HANDLE,
    password: <string>Bun.env.TEST_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
// This function is required! It sets up your bluesky agent
agentDetails = createAgent(agentDetails)
```

Create a simple Handler
```typescript
let handler = new PostHandler(
        [new InputStartsWithValidator("Hello!")],
        [new ReplyWithInputAction("Hi!")],
        true
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
    agentDetails = await authenticateAgent(agentDetails)

    handlerController = new HandlerController(agentDetails, [
        // Handlers can also be created in other files and imported
      handler
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
    ReplyWithInputAction
} from "bsky-event-handlers";

// Agent details
let agentDetails: AgentDetails = {
    name: "test-bot",
    did: undefined,
    handle: <string>Bun.env.TEST_BSKY_HANDLE,
    password: <string>Bun.env.TEST_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
agentDetails = createAgent(agentDetails)

let handler = new PostHandler(
        [new InputStartsWithValidator("Hello!")],
        [new ReplyWithInputAction("Hi!")],
        true
    );


//Create Handler controller
let handlerController: HandlerController;

// Initialize the agent and handler
async function initialize() {
    agentDetails = await authenticateAgent(agentDetails)

    handlerController = new HandlerController(agentDetails, [
        handler
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
const firehoseSubscription = new FirehoseSubscription([handlerController], 150);
```

For full example code, see my [Test firehose bot](https://github.com/juni-b-queer/test-firehose-bot)


# Overview
I wrote this package because I wanted a simple and quick way to get firehose bluesky bots up and running.
Bluesky Event Handlers is a powerful, adaptable package developed for creating bots within the Bluesky ecosystem. The package offers a wide array of inbuilt validators and action handlers to facilitate the creation of event-driven bot actions- all of which contribute to smoother, faster, and more efficient bot development.

The package internally uses the Bluesky Agent to interact with the Bluesky network. The flexibility provided by the AbstractValidator and AbstractTriggerAction base classes, paves the way for easy extension and creation of custom validators and actions to suit your specific requirements.

By leveraging the combination of Validators and Actions, you can create a unique sequence of automatic responses for your bot in response to defined triggers, enhancing your bot's interactivity, flexibility and efficiency.


# Validators
Validators are used to determine whether or not an action should be triggered. We provide a variety of preset validators, such as checking if the post starts with, contains or matches a certain string, or was posted by a specific user. Moreover, the package allows for the creation of custom validators per your requirement.
- [Basic Validator](#basic-validator)
    - [SimpleFunctionValidator](#simplefunctionvalidator)
    - [OrValidator](#orvalidator)
- [Post Validators](#post-validators)
    - [PostedByUserValidator](#postedbyuservalidator)
    - [ReplyingToBotValidator](#replyingtobotvalidator)
    - [IsReplyValidator](#isreplyvalidator)
- [String Validators](#string-validators)
    - [InputIsCommandValidator](#inputiscommandvalidator)
    - [InputStartsWithValidator](#inputstartswithvalidator)
    - [InputContainsValidator](#inputcontainsvalidator)
    - [InputEqualsValidator](#inputequalsvalidator)


## Basic validator
### SimpleFunctionValidator
The `SimpleFunctionValidator` class provides a way to create a validator by passing a single function that accepts the ValidatorInput object and returns a boolean indicating whether to trigger the action or not.
 
`new SimpleFunctionValidator((validatorInput) => { return true; }); // replace function with specific condition`

### OrValidator
The `OrValidator` class allows you to pass in multiple validators. If any of these validators return `true`, it will trigger the action.

`new OrValidator([validator1, validator2, validator3]); // replace with actual validator instances`

## Post validators
### PostedByUserValidator
The `PostedByUserValidator` class checks if the post was made by a specific user, identified by their DID (Decentralized Identifier).

`new PostedByUserValidator('did:user:123');`

### ReplyingToBotValidator
The `ReplyingToBotValidator` class verifies if the post is a reply to the bot.

`new ReplyingToBotValidator();`

### IsReplyValidator
The `IsReplyValidator` class checks if the post is a reply to another post.

`new IsReplyValidator();`

## String Validators
### InputIsCommandValidator
 The `InputIsCommandValidator` class validates if the input is a command triggered by a specific key. The `strict` argument enforces case sensitivity when set to `true`.

`new InputIsCommandValidator('myTriggerKey', true); // enabling strict mode`

### InputStartsWithValidator
The `InputStartsWithValidator` class checks if the input starts with a specific key. The `strict` argument, when set to `true`, enforces case sensitivity.

`new InputStartsWithValidator('myTriggerKey', true);`

### InputContainsValidator
The `InputContainsValidator` class verifies if the input contains a specific key.

`new InputContainsValidator('myTriggerKey');`

### InputEqualsValidator
The `InputEqualsValidator` class checks if the input exactly matches a specific key.

`new InputEqualsValidator('myTriggerKey');`

# Actions
Actions are the set of operations that are executed in response to certain validation or criteria fulfillment. This could range from sending reply posts, logging particular information, or executing any function, to more complex sequences of operations. You even have the ability to create custom actions based on your needs.
- [FunctionAction](#functionaction)
- [Reply Actions](#reply-actions)
    - [ReplyWithInputAction](#replywithinputaction)
    - [ReplyWithGeneratedTextAction](#replywithgeneratedtextaction)
    - [ReplyRepetitivelyFromStringArray](#replyrepetitivelyfromstringarray)
- [Logging Actions](#logging-actions)
    - [LogPostDetailsAction](#logpostdetailsaction)
    - [LogRepoOperationAction](#logrepooperationaction)
    - [LogInputTextAction](#loginputtextaction)

### FunctionAction
The `FunctionAction` class takes a function as an argument. This function gets executed when the handle method is called and it should accept `AgentDetails`, `RepoOp`, and `PostDetails` as arguments.

`new FunctionAction((agentDetails, op, postDetails) => { // Function implementation goes here });`

## Reply Actions
### ReplyWithInputAction
The `ReplyWithInputAction` class takes a predefined response text as input and sends it as a reply to a post.

`new ReplyWithInputAction("This is my response text");`

### ReplyWithGeneratedTextAction
The `ReplyWithGeneratedTextAction` class leverages a reply generating function to generate a reply to a post. The function should return a string which will be used as the response text.

`new ReplyWithGeneratedTextAction(myResponseTextGeneratingFunction);`

### ReplyRepetitivelyFromStringArray
The `ReplyRepetitivelyFromStringArray` class takes in an array of strings. Each string is sent as a reply to the post, one after another, with a delay of 50 milliseconds in between each post.

`new ReplyRepetitivelyFromStringArray(["Response text 1", "Response text 2", "Response text 3"]);`

## Logging Actions
### LogPostDetailsAction
The `LogPostDetailsAction` class logs the post details when the handle method is called.

`new LogPostDetailsAction();`

### LogRepoOperationAction
The `LogRepoOperationAction` class logs the repository operation details when the handle method is called.

`new LogRepoOperationAction()`

### LogInputTextAction
The `LogInputTextAction` class takes a predefined string as input and logs it when the handle method is called.

`new LogInputTextAction("This is my log text");`

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
postHandler.setFollowers(['did:user:123']);
```

### Example
This is a simple handler that uses the predefined validators and actions.

When a post Starts with "Hello world!", the bot will reply with "Hi!". The boolean at the end is to indicate that
the bot will only reply to it's followers. When set to false, it will respond to anyone on the network.
```typescript
import {InputStartsWithValidator, ReplyWithInputAction, PostHandler} from "bsky-event-handlers";

export let TestHandler = new PostHandler(
    [new InputStartsWithValidator("Hello world!")],
    [new ReplyWithInputAction("Hi!")],
    true
)
```

# Handler Controller
The `HandlerController` class takes in an `AgentDetails` object, a list of handlers (which could be of any class that extends `AbstractPayloadHandler`), and a boolean to specify if the bot should only reply to users its following.

The `HandlerController` is responsible for refreshing follower lists, and distributing operations to each handler. Refreshing followers, enables the `PostHandler` objects to know who the bot is currently following, ensuring the bot only reacts to posts from following users if specified.

Here's an example of how to use it:
```typescript
// Import required classes 
import { PostHandler, InputStartsWithValidator, ReplyWithInputAction, AgentDetails, HandlerController } from "bsky-event-handlers";
// Define Agent Details 
let agentDetails: AgentDetails = { }; // add the required agent details here
// Create Validators 
let validators = [new InputStartsWithValidator("Hello!")];
// Define Actions 
let actions = [new ReplyWithInputAction("Hi!")];
// Create Handler 
let handler = new PostHandler(validators, actions, true);
// Create Handler Controller 
let handlerController = new HandlerController(agentDetails, [handler]);
```

# Firehose Subscription
The `FirehoseSubscription` class sets up a subscription to the Bluesky event firehose. It allows the bot to receive real-time post updates pushed directly from the firehose.

The `FirehoseSubscription` takes in an array of `HandlerControllers`, which define how to process the received repository operations. It filters the received operations into two types: those that reply to posts and those that do not, and hands them off to the corresponding `HandlerControllers` accordingly.

If the firehose stops sending updates for any reason, the `FirehoseSubscription` has a built-in mechanism to check for that and restart the subscription as needed.

Here's an example of how to use it:
```typescript
// Import required classes 
import { PostHandler, InputStartsWithValidator, ReplyWithInputAction, AgentDetails, HandlerController, FirehoseSubscription } from "bsky-event-handlers";
// Define Agent Details 
let agentDetails: AgentDetails = {};  // add the required agent details here
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

# Credits
## Packages used
- [atproto-firehose](https://www.npmjs.com/package/atproto-firehose)
- [@atproto/api](https://www.npmjs.com/package/@atproto/api)
