# Firehose Subscription

The `JetstreamSubscription` class sets up a subscription to a Jetstream bluesky relay instance

The following example assumes you have a handler set up already:

```typescript
import { JetstreamSubscriptionHandlers, JetstreamSubscription } from "bsky-event-handlers";

// Code for setting up agents goes here

// Assume handlers are set up already
const handlers: JetstreamSubscriptionHandlers = { /* Your handlers here */ };

let jetstreamSubscription: JetstreamSubscription;

async function initialize() {
  // Code for authenticating agents goes here
  
  // Initialize the JetstreamSubscription with your handlers and WebSocket URL
  jetstreamSubscription = new JetstreamSubscription(
    handlers,
    <string>Bun.env.JETSTREAM_URL,
  );
}

initialize().then(() => {
  // Create a subscription
  jetstreamSubscription.createSubscription();
});
```

The jetstream subscription accepts an object of type `JetstreamSubscriptionHandlers`
This interface provides a blueprint for defining handlers for various events such as "post", "like", "repost", "follow". 
For each event, you can specify create-and-delete handlers through the CreateAndDeleteHandlersInterface.
```typescript
const handlers: JetstreamSubscriptionHandlers = {
  post: {
    c: [],
    d: [],
  },
  like:{
    c: [],
    d: [],
  },
  follow:{
    c: [],
    d: [],
  },
  repost:{
    c: [],
    d: [],
  },
}
```

This also allows the JetstreamSubscription to automatically subscribe to only events that it's handling.
