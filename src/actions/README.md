# Actions

Actions are the set of operations that are executed in response to certain validation or criteria fulfillment. This could range from sending reply posts, logging particular information, or executing any function, to more complex sequences of operations. You even have the ability to create custom actions based on your needs.

## Create an Action

Coming soon (also you can just look at the code of the existing ones for now, they're pretty simple)

## Existing Actions

- [FunctionAction](#functionaction)
- [Logging Actions](#logging-actions)
  - [LogMessageAction](#logmessageaction)
  - [LogInputTextAction](#loginputtextaction)
  - [DebugLogAction](#debuglogaction)
- Post
  - [Skeet Actions](#skeet-actions)
    - [CreateSkeetAction](#createskeetaction)
    - [CreateSkeetWithGeneratedTextAction](#createskeetwithgeneratedtextaction)
    - [ReplyToSkeetAction](#replytoskeetaction)
    - [ReplyToSkeetWithGeneratedTextAction](#replytoskeetwithgeneratedtextaction)

## FunctionAction

The `FunctionAction` class takes a function as an argument. This function gets executed when the handle method is called and it should accept `JeststreamMessage` and `HandlerAgent` as arguments.

`new FunctionAction((message, handlerAgent) => { // Function implementation goes here });`

## Logging Actions

### LogMessageAction

The `LogMessageAction` class logs message received from jetstream.

`new LogMessageAction();`

### LogInputTextAction

The `LogInputTextAction` class logs given input text.

`new LogInputTextAction("input text")`

### DebugLogAction

The `DebugLogAction` class will output to the log using the DebugLog class. give it the action, the message, and log level

`new DebugLogAction("Action", "Text", info|warn|error);`

## Skeet Actions

### CreateSkeetAction

Pass in a string, and when the validations pass, it will create a new skeet from the agent with the given input text.

`new CreateSkeetAction("Skeet text")`

### CreateSkeetWithGeneratedTextAction

The `CreateSkeetWithGeneratedTextAction` accepts a function with 2 arguments, `JetstreamMessage` and `HandlerAgent`. This function should return a string
When the validations pass, it will call the function to generate the response text

`new CreateSkeetWithGeneratedTextAction((message: JetstreamMessage, handlerAgent) => { // Function implementation goes here });`

### ReplyToSkeetAction

The `ReplyToSkeetAction` only works on post creation messages for now.
Pass in a string, and when the validations pass, it will reply to the created skeet with a new skeet using the given input text

`new ReplyToSkeetAction("Reply Text")`

### ReplyToSkeetWithGeneratedTextAction

The `ReplyToSkeetWithGeneratedTextAction` only works on post creation messages for now.
Similar to the CreateSkeetWithGeneratedTextAction, it accepts a function with 2 arguments, but the first is a `CreateSkeetMessage` and the second is the same, being a `HandlerAgent`. This function should return a string
When the validations pass, it will call the function to generate the response text

`new ReplyToSkeetWithGeneratedTextAction((message: CreateSkeetMessage, handlerAgent) => { // Function implementation goes here });`