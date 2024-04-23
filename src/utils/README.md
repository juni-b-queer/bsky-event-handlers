# Utility functions

## DebugLog

This is a class that will output a standardized log message
`DebugLog.log(event, message, level)` is the most basic, where you set where the log is happening, a message, and the log level
Other functions that can be used are `DebugLog.info(event, message)`, `DebugLog.warn(event, message)`, and `DebugLog.error(event, message)` respectively

### Example

```typescript
DebugLog.info("GOOD BOT", "Told I'm good :)");
```

will output

```
4/23/2024, 02:40 PM | GOOD BOT | INFO | Told I'm good :)
```

more docs coming soon?
