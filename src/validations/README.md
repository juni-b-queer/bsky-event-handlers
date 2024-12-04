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
        -   [NewFollowFromUserValidator](#newfollowfromuservalidator)
        -   [UserFollowedValidator](#userfollowedvalidator)
-   Like
    -   [Like Validators](#like-validators)
        -   [PostLikesValidator](#postlikesvalidator)
        -   [LikeByUser](#likebyuser)
        -   [LikeOfUser](#likeofuser)
        -   [LikeOfPost](#likeofpost)
-   Repost
    -   [Repost Validators](#repost-validators)
        -   [RepostByUser](#repostbyuser)
        -   [RepostOfUser](#repostofuser)
        -   [RepostOfPost](#repostofpost)
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

    async handle(handlerAgent: HandlerAgent, messsage: JetstreamEventCommit): Promise<boolean> {
        // This example takes in a boolean, and returns it from should trigger.
        return message.commit.operation === 'create' && this.shouldPass;
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


### Like Validators

#### PostLikesValidator

The `PostLikesValidator` checks if a post's like count matches certain criteria, such as being equal to, greater than, less than, or between specified values.

```typescript
PostLikesValidator.make(
    postUri: string,
    comparisonType: 'equal' | 'greaterThan' | 'lessThan' | 'between',
    likeCount?: number, // Required for 'equal', 'greaterThan', 'lessThan'
    likeCountMin?: number, // Required for 'between'
    likeCountMax?: number // Required for 'between'
)
```
- **postUri**: The URI of the post to be checked.
- **comparisonType**: The type of comparison to perform (`'equal'`, `'greaterThan'`, `'lessThan'`, `'between'`).
- **likeCount**: The like count to compare against (optional for `'between'`).
- **likeCountMin**: The minimum like count for the `'between'` comparison.
- **likeCountMax**: The maximum like count for the `'between'` comparison.

```typescript
// Validate if the number of likes on a post is exactly 100
PostLikesValidator.make('postUri', 'equal', 100);

// Validate if the number of likes on a post is greater than 50
PostLikesValidator.make('postUri', 'greaterThan', 50);

// Validate if the number of likes on a post is less than 10
PostLikesValidator.make('postUri', 'lessThan', 10);

// Validate if the number of likes on a post is between 20 and 30
PostLikesValidator.make('postUri', 'between', undefined, 20, 30);
```

#### LikeByUser

The `LikeByUser` validator checks if a specified user has liked a particular post. It can be configured to either validate likes from the bot user or a specific user if a user DID is provided.

```typescript
// Validate if a specific user liked a specific post
import { LikeByUser } from './LikeUserValidators';

LikeByUser.make('userDid123', 'postUri');

// Validate if the current handlerAgent user liked a specific post
LikeByUser.make(undefined, 'postUri');

// This is the same behavior as above
LikeByUser.make(handlerAgent.getDid, 'postUri')
```

#### LikeOfUser

The `LikeOfUser` validator ensures that a post liked by someone is from a specified user.

```typescript
// Validate if a post from a specific user was liked
LikeOfUser.make('userDid123', undefined);

// Validate if a specific post from any user was liked
LikeOfUser.make(undefined, 'postUri');
```

#### LikeOfPost

The `LikeOfPost` validator checks if the event is a like on a specific post.

```typescript
// Validate if a specific post has been liked
LikeOfPost.make('postUri');
```

### Repost Validators

#### RepostByUser

The `RepostByUser` validator checks if a specified user has reposted a particular post.

```typescript
// Validate if a specific user reposted a specific post
RepostByUser.make('userDid123', 'postUri');

// Validate if the bot user reposted a specific post
RepostByUser.make(undefined, 'postUri'); // same as make(handlerAgent.getDid, 'postUri')
```

#### RepostOfUser

The `RepostOfUser` validator ensures that the reposted post is from a specific user

```typescript
// Validate if a post from a specific user was reposted
RepostOfUser.make('userDid123', undefined);

// Validate if a specific post from the bot user was reposted
RepostOfUser.make(undefined, 'postUri');
```


#### RepostOfPost

The `RepostOfPost` validator checks if reposts are directed towards a specific post

```typescript
// Validate if a specific post has been reposted
RepostOfPost.make('postUri');
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
