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
      handlerAgent: HandlerAgent,
      ...args: any
    ): Promise<boolean> {
        // Perform validation
        // must return a boolean
    }
}
```

Any additional parameters you may need for the action can be passed into the constructor and used within the handle function as needed, like so:
```typescript
export class ExampleValidator extends AbstractValidator {
    constructor(private shouldPass: boolean) {
        super();
    }

    async handle(handlerAgent: HandlerAgent, messsage: CreateSkeetMessage): Promise<boolean> {
        // This example takes in a boolean, and returns it from should trigger.
        return this.message.opType === 'c' && this.shouldPass;
    }
}
```

## Logical Validator

### SimpleFunctionValidator

The SimpleFunctionValidator class provides a way to create a validator by passing a single function that accepts the HandlerAgent and returns a boolean indicating whether to trigger the action or not.
```typescript
SimpleFunctionValidator.make((handlerAgent) => { return true; });
```
If it's being used for a message handler, you can expect the message parameter in the function as well
```typescript
SimpleFunctionValidator.make((handlerAgent, message) => { 
    // perform validation with message
});
```

### OrValidator

The OrValidator class allows you to pass in multiple validators. If any of these validators return true, it will trigger the action.
```typescript
OrValidator.make([validator1, validator2, validator3]); // replace with actual validator instances
```

## Generic Validators

### ActionTakenByUserValidator

The ActionTakenByUserValidator class checks if the action (post, repost, etc.) was taken by a specified user.
```typescript
ActionTakenByUserValidator.make('userDid');
```

### Post Validators

### PostedByUserValidator

The PostedByUserValidator checks if a post was created by a specific user.
```typescript
PostedByUserValidator.make('userDid');
```

### ReplyingToBotValidator

The ReplyingToBotValidator checks if a post is a reply to the bot.
```typescript
ReplyingToBotValidator.make();
```

### IsReplyValidator

The IsReplyValidator checks if a post is a reply.
```typescript
IsReplyValidator.make();
```

### String Validators

### InputIsCommandValidator

The InputIsCommandValidator checks if a post starts with a specific command trigger.
```typescript
InputIsCommandValidator.make('triggerKey', true); // strict mode
```

### InputStartsWithValidator

The InputStartsWithValidator checks if a post starts with a specific string.
```typescript
InputStartsWithValidator.make('triggerKey', true); // strict mode
```

### InputContainsValidator

The InputContainsValidator checks if a post contains a specific string.
```typescript
InputContainsValidator.make('triggerKey', true); // strict mode
```

### InputEqualsValidator

The InputEqualsValidator checks if a post equals a specific string.
```typescript
InputEqualsValidator.make('triggerKey');
```

### Bot Validators

### IsGoodBotValidator

The IsGoodBotValidator checks if a post responds positively to the bot.
```typescript
IsGoodBotValidator.make();
```

### IsBadBotValidator

The IsBadBotValidator checks if a post responds negatively to the bot.
```typescript
IsBadBotValidator.make();
```

### Follow Validators

### NewFollowerForUserValidator

The NewFollowerForUserValidator checks if a user has a new follower.
```typescript
NewFollowerForUserValidator.make('userDid');
```

### NewFollowFromUserValidator

The NewFollowFromUserValidator checks if a user has followed someone.
```typescript
NewFollowFromUserValidator.make('userDid');
```

### UserFollowedValidator

The UserFollowedValidator (alias for NewFollowFromUserValidator) checks if a user has followed someone. (To be deprecated in next major release)
```typescript
UserFollowedValidator.make('userDid');
```

## Testing

### Test Validator

The TestValidator is used for unit testing your validator logic.
```typescript
TestValidator.make(true); // Returns an instance that will pass
```

### Specialized Validators

### IsSpecifiedTimeValidator

The IsSpecifiedTimeValidator checks if the current time matches any specified times.
```typescript
IsSpecifiedTimeValidator.make('HH:MM', 'HH:MM');
```

### IsFourTwentyValidator

The IsFourTwentyValidator checks if the current time is 4:20 AM or PM in any timezone.
```typescript
IsFourTwentyValidator.make();
```
