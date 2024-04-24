# Validators

Validators are used to determine whether or not an action should be triggered. We provide a variety of preset validators, such as checking if the post starts with, contains or matches a certain string, or was posted by a specific user. Moreover, the package allows for the creation of custom validators per your requirement.

## Create a Validator

Coming soon (also you can just look at the code of the existing ones for now, they're pretty simple)

## Existing Validators

- [Logical Validator](#logical-validator)
  - [SimpleFunctionValidator](#simplefunctionvalidator)
  - [OrValidator](#orvalidator)
- [Generic Validators](#generic-validators)
  - [ActionTakenByUserValidator](#actiontakenbyuservalidator)
- Posts
  - [Post Validators](#post-validators)
    - [PostedByUserValidator](#postedbyuservalidator)
    - [ReplyingToBotValidator](#replyingtobotvalidator)
    - [IsReplyValidator](#isreplyvalidator)
  - [String Validators](#string-validators)
    - [InputIsCommandValidator](#inputiscommandvalidator)
    - [InputStartsWithValidator](#inputstartswithvalidator)
    - [InputContainsValidator](#inputcontainsvalidator)
    - [InputEqualsValidator](#inputequalsvalidator)
  - [Bot Validators](#bot-validators)
    - [IsGoodBotValidator](#isgoodbotvalidator)
    - [IsBadBotValidator](#isbadbotvalidator)
- Follow
  - [Follow Validators](#follow-validators)
    - [NewFollowerForUserValidator](#newfollowerforuservalidator)
    - [UserFollowedValidator](#userfollowedvalidator)
- Like
  - Coming soon
- Repost
  - Coming soon
- Testing
  - [Test Validator](#test-validator)

## Logical validator

### SimpleFunctionValidator

The `SimpleFunctionValidator` class provides a way to create a validator by passing a single function that accepts the JetstreamMessage and HandlerAgent and returns a boolean indicating whether to trigger the action or not.

`new SimpleFunctionValidator((message, handlerAgent) => { return true; }); // replace function with specific condition`

### OrValidator

The `OrValidator` class allows you to pass in multiple validators. If any of these validators return `true`, it will trigger the action.

`new OrValidator([validator1, validator2, validator3]); // replace with actual validator instances`

## Generic Validators

### ActionTakenByUserValidator

The `ActionTakenByUserValidator` class checks if the action (post, repost, like, follow) was done by a given user

`new ActionTakenByUserValidator('did:plc:123');`

## Post validators

### PostedByUserValidator

The `PostedByUserValidator` class checks if the post was made by a specific user, identified by their DID (Decentralized Identifier).

`new PostedByUserValidator('did:plc:123');`

### ReplyingToBotValidator

The `ReplyingToBotValidator` class verifies if the post is a reply to the bot/handlerAgent.

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

## Bot Validators

### IsGoodBotValidator

The `IsGoodBotValidator` class checks if the input is replying to the bot and the text is "{positive word} bot" (ex. good bot).

It will also accept "thank you" (for full list of accepted inputs, see `isGoodBotResponse` in `utils/text-utils`)

`new IsGoodBotValidator();`

### IsBadBotValidator

The `IsBadBotValidator` class checks if the input is replying to the bot and the text is "{negative word} bot" (ex. bad bot).

(for full list of accepted inputs, see `isBadBotResponse` in `utils/text-utils`)

`new IsBadBotValidator();`

## Follow Validators

### NewFollowerForUserValidator

The `NewFollowerForUserValidator` will return true if the follow action was a new follower for the given user
If no did is provided, it will default to the bot/handlerAgent did

`new NewFollowerForUserValidator('did:plc:123');`

### UserFollowedValidator

The `UserFollowedValidator` will return true if the follow action was the given user following someone
If no did is provided, it will default to the bot/handlerAgent did

`new UserFollowedValidator('did:plc:123');`

## Test Validator

### TestValidator

The `TestValidator` class accepts a boolean in the constructor, and then returns that boolean when validated. Mostly used for testing

`new TestValidator(true|false);`