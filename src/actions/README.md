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
