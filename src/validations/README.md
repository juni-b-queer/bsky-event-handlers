# Validators

Validators are used to determine whether an action should be triggered. We provide a variety of preset validators, such as checking if the post starts with, contains or matches a certain string, or was posted by a specific user. Moreover, the package allows for the creation of custom validators per your requirement.

## Existing Validators

-   [Logical Validator](#logical-validator)
    -   [SimpleFunctionValidator](#simplefunctionvalidator)
    -   [OrValidator](#orvalidator)
-   [Generic Validators](#generic-validators)
    -   [ActionTakenByUserValidator](#actiontakenbyuservalidator)
-   Posts
    -   [Post Validators](#post-validators)
        -   [PostedByUserValidator](#postedbyuservalidator)
        -   [ReplyingToBotValidator](#replyingtobotvalidator)
        -   [IsReplyValidator](#isreplyvalidator)
    -   [String Validators](#string-validators)
        -   [InputIsCommandValidator](#inputiscommandvalidator)
        -   [InputStartsWithValidator](#inputstartswithvalidator)
        -   [InputContainsValidator](#inputcontainsvalidator)
        -   [InputEqualsValidator](#inputequalsvalidator)
    -   [Bot Validators](#bot-validators)
        -   [IsGoodBotValidator](#isgoodbotvalidator)
        -   [IsBadBotValidator](#isbadbotvalidator)
-   Follow
    -   [Follow Validators](#follow-validators)
        -   [NewFollowerForUserValidator](#newfollowerforuservalidator)
        -   [UserFollowedValidator](#userfollowedvalidator)
-   Like
    -   Coming soon
-   Repost
    -   Coming soon
-   Testing
    -   [Test Validator](#test-validator)

## Validator factories

Validator factories enable you to instantiate factories quickly and easily
All validators included here have a static `make` function

```typescript
TestValidator.make(true); // Returns an instance of TestValidator that will return true
```

Is the same as

```typescript
new TestValidator(true);
```

But with the factory, you're able to easily chain the `not` function to negate the output

```typescript
TestValidator.make(true).not(); // Returns an instance of TestValidator that will return false
```

## Creating a validator

Validators are fairly simple, it should extend `AbstractValidator` and have `constructor` and `handle` functions. (optionally a `make` function)

The `handle` function is what's called to check if it passes, and must return a boolean

```typescript
export class ExampleValidator extends AbstractValidator {
    constructor() {
        super();
    }

    async handle(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        // Perform validation
        // must return a boolean
    }
}
```

Any additional parameters you may need for the action can be passed into the constructor and used within the `handle` function as needed, like so

```typescript
export class ExampleValidator extends AbstractValidator {
    constructor(private shouldPass: boolean) {
        super();
    }

    async handle(
        message: CreateSkeetMessage,
        handlerAgent: HandlerAgent
    ): Promise<boolean> {
        // This example takes in a boolean, and returns it from should trigger.
        return this.shouldPass;
    }
}
```

## Logical validator

### SimpleFunctionValidator

The `SimpleFunctionValidator` class provides a way to create a validator by passing a single function that accepts the JetstreamMessage and HandlerAgent and returns a boolean indicating whether to trigger the action or not.

`SimpleFunctionValidator.make((message, handlerAgent) => { return true; }); // replace function with specific condition`

### OrValidator

The `OrValidator` class allows you to pass in multiple validators. If any of these validators return `true`, it will trigger the action.

`OrValidator.make([validator1, validator2, validator3]); // replace with actual validator instances`

## Generic Validators

### ActionTakenByUserValidator

The `ActionTakenByUserValidator` class checks if the action (post, repost, like, follow) was done by a given user

`ActionTakenByUserValidator.make('did:plc:123');`

## Post validators

### PostedByUserValidator

The `PostedByUserValidator` class checks if the post was made by a specific user, identified by their DID (Decentralized Identifier).

`PostedByUserValidator.make('did:plc:123');`

### ReplyingToBotValidator

The `ReplyingToBotValidator` class verifies if the post is a reply to the bot/handlerAgent.

`ReplyingToBotValidator.make();`

### IsReplyValidator

The `IsReplyValidator` class checks if the post is a reply to another post.

`IsReplyValidator.make();`

## String Validators

### InputIsCommandValidator

The `InputIsCommandValidator` class validates if the input is a command triggered by a specific key. The `strict` argument enforces case sensitivity when set to `true`.

`InputIsCommandValidator.make('myTriggerKey', true); // enabling strict mode`

### InputStartsWithValidator

The `InputStartsWithValidator` class checks if the input starts with a specific key. The `strict` argument, when set to `true`, enforces case sensitivity.

`InputStartsWithValidator.make('myTriggerKey', false);`

### InputContainsValidator

The `InputContainsValidator` class verifies if the input contains a specific key. The `strict` argument, when set to `true`, enforces case sensitivity.

`InputContainsValidator.make('myTriggerKey', false);`

### InputEqualsValidator

The `InputEqualsValidator` class checks if the input exactly matches a specific key.

`InputEqualsValidator.make('myTriggerKey');`

## Bot Validators

### IsGoodBotValidator

The `IsGoodBotValidator` class checks if the input is replying to the bot and the text is "{positive word} bot" (ex. good bot).

It will also accept "thank you" (for full list of accepted inputs, see `isGoodBotResponse` in `utils/text-utils`)

`IsGoodBotValidator.make();`

### IsBadBotValidator

The `IsBadBotValidator` class checks if the input is replying to the bot and the text is "{negative word} bot" (ex. bad bot).

(for full list of accepted inputs, see `isBadBotResponse` in `utils/text-utils`)

`IsBadBotValidator.make();`

## Follow Validators

### NewFollowerForUserValidator

The `NewFollowerForUserValidator` will return true if the follow action was a new follower for the given user
If no did is provided, it will default to the bot/handlerAgent did

`NewFollowerForUserValidator.make('did:plc:123');`

### NewFollowFromUserValidator

The `NewFollowFromUserValidator` will return true if the follow action was the given user following someone
If no did is provided, it will default to the bot/handlerAgent did

`NewFollowFromUserValidator.make('did:plc:123');`

**Was previously `UserFollowedValidator` (which still works for now) but has been renamed to fit with the other follow validators**

## Test Validator

### TestValidator

The `TestValidator` class accepts a boolean in the constructor, and then returns that boolean when validated. Mostly used for testing

`TestValidator.make(true|false);`
