# Subscriptions

### Jetstream subscription
See [firehose README](./firehose/README.md)

### Interval subscription

The interval subscription works a lot like the Jetstream subscription, where it has handlers with validators and actions, the difference being, the validators and actions don't get a Jetstream event.
To start using an interval subscription, you'll need your intervalSubscriptionHandlers array. In this example, I'm using the IsIt420 bot as an example.

IntervalSubscriptionHandlers is an array of IntervalSchemaInterface.
The IntervalSchemaInterface consists of two parts. the `intervalSeconds`, which is how often the interval will run, and the `handlers` which are multiple abstract handlers with validators, actions, and a HandlerAgent.

```typescript
const intervalSubscriptionHandlers: IntervalSubscriptionHandlers = [
    {
        intervalSeconds: 60,
        handlers:[
            new AbstractHandler(
                [IsFourTwentyValidator.make()],
                [
                    LogInputTextAction.make("Is 4:20"),
                    CreateSkeetAction.make("It's 4:20 somewhere!")
                ],
                testAgent),
            new AbstractHandler(
                [IsFourTwentyValidator.make().not()],
                [
                    LogInputTextAction.make("Is not 4:20"),
                    CreateSkeetAction.make("It's not 4:20 anywhere :(")

                ],
                testAgent)
        ]
    }
]
```

Once the handlers are prepared, create the subscription object, and start the intervals
```typescript
const intervalSubscription = new IntervalSubscription(
    intervalSubscriptionHandlers
)

intervalSubscription.createSubscription()
```

Ensure that you have also created and authenticated your Handler Agent

```typescript
// before the Handlers are made
const testAgent = new HandlerAgent(
    'test-bot',
    <string>Bun.env.IS_IT_FOUR_TWENTY_HANDLE,
    <string>Bun.env.IS_IT_FOUR_TWENTY_PASSWORD
);

// before the subscription starts
await testAgent.authenticate()
```
