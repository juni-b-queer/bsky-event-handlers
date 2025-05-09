# Utility functions

## DebugLog

This is a class that will output a standardized log message
`DebugLog.log(event, message, level)` is the most basic, where you set where the log is happening, a message, and the log level
Other functions that can be used are `DebugLog.info(event, message)`, `DebugLog.warn(event, message)`, and `DebugLog.error(event, message)` respectively

### Example

```typescript
DebugLog.info('GOOD BOT', "Told I'm good :)");
```

will output

```
4/23/2024, 02:40 PM | GOOD BOT | INFO | Told I'm good :)
```

more docs coming soon?

### TypeOrFunction Utilities
Sometimes in the program, we want to either pass in a defined value with a specific type, or use a function during runtime to get the value of a specific type. These functions are helpers to make that easier \
Theses util functions take the same structure of parameters
`(valueOrFunction: Type | function, handlerAgent: HandlerAgent, ...args: any)`

The function that it accepts should have the parameters `(handlerAgent: HandlerAgent, ...args: any)` and should return a value with the Type specified by the function

-   `getStringOrFunctionReturn` - accepts a string or function and returns either the string, or the string returned by the function
-   `getStringArrayOrFunctionReturn` - accepts a string array or function and returns either the string array, or the string array returned by the function
-   `getJetstreamSubjectOrFunctionReturn` - accepts a JetstreamSubject or function and returns either the JetstreamSubject, or the JetstreamSubject returned by the function
