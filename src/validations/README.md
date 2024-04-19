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