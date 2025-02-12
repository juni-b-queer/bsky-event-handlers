# Openshock Integration

## [DIY Setup Walkthrough](./examples/OpenShockDIYGuide.md)


## Openshock Client
The client is necessary to send requests to the Openshock platform

```typescript
const client = OpenshockClient('API_TOKEN');
```

## Provided Actions

-   [OpenshockControlDeviceAction](#openshockcontroldeviceaction)
-   [OpenshockShockAction](#openshockshockaction)
-   [OpenshockVibrateAction](#openshockvibrateaction)

---

## OpenshockControlDeviceAction

### Overview

The `OpenshockControlDeviceAction` is designed to control devices managed by an `OpenshockClient`. It supports dynamic customization of parameters such as the device IDs to control, intensity, duration, type of control (shock or vibrate), and whether the control mode is exclusive.

### Constructor Parameters

- **`client`**: An instance of `OpenshockClient` used to send commands to the connected devices.
- **`shockerIDs`**: A list of device IDs or a function to dynamically determine the IDs based on the `HandlerAgent`.
    - Type: `string[]` or `(handlerAgent: HandlerAgent, ...args: any) => string[]`
- **`intensity`**: The intensity level of the command, represented as a percentage between 0 and 100. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `25`
- **`duration`**: Duration of the command in milliseconds, which must be between 300 ms and 30000 ms. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `300`
- **`exclusive`**: A flag to determine if the control should be exclusive (i.e., no other actions overlapping). Can be static or dynamically determined.
    - Type: `boolean` or `(handlerAgent: HandlerAgent, ...args: any) => boolean`
    - Default: `true`
- **`controlType`**: The type of control method to use, either `Shock` or `Vibrate`. This can be a static value or generated dynamically from a function.
    - Type: `'Shock' | 'Vibrate' | (handlerAgent: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate'`
    - Default: `'Shock'`

---

### Factory Method: `make`

The `make` static method provides a convenient way to create an instance of `OpenshockControlDeviceAction`.

```typescript
OpenshockControlDeviceAction.make(
    client: OpenshockClient,
    shockerIDs: string[] | ((handlerAgent: HandlerAgent, ...args: any) => string[]),
    intensity?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    duration?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    exclusive?: boolean | ((handlerAgent: HandlerAgent, ...args: any) => boolean),
    controlType?: 'Shock' | 'Vibrate' | ((handlerAgent: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate')
): OpenshockControlDeviceAction
```

### Example Usage

#### Static Parameters

```typescript
const client = new OpenshockClient('API_TOKEN');

const handlers: JetstreamSubscriptionHandlers = {
    post: {
        c: [
            MessageHandler.make(
                [InputEqualsValidator.make('Hello')],
                [
                    OpenshockControlDeviceAction.make(
                        client,              // An instance of OpenshockClient
                        ['device1', 'device2'],  // Static list of shocker IDs
                        50,                  // Intensity: 50%
                        1000,                // Duration: 1 second
                        true,                // Exclusive mode enabled
                        'Vibrate'            // Control type: Vibrate
                    )
                ],
                testAgent
            ),
        ],
    },
};
```

#### Dynamic Parameters

All parameters with an optional function type are evaluated at runtime and can be used to vary values based on the input from the subscription used.


---

## OpenshockShockAction

### Overview

The `OpenshockShockAction` is designed to be an easier to use action for sending shocks

### Constructor Parameters

- **`client`**: An instance of `OpenshockClient` used to send commands to the connected devices.
- **`shockerIDs`**: A list of device IDs or a function to dynamically determine the IDs based on the `HandlerAgent`.
    - Type: `string[]` or `(handlerAgent: HandlerAgent, ...args: any) => string[]`
- **`intensity`**: The intensity level of the command, represented as a percentage between 0 and 100. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `25`
- **`duration`**: Duration of the command in milliseconds, which must be between 300 ms and 30000 ms. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `300`
- **`exclusive`**: A flag to determine if the control should be exclusive (i.e., no other actions overlapping). Can be static or dynamically determined.
    - Type: `boolean` or `(handlerAgent: HandlerAgent, ...args: any) => boolean`
    - Default: `true`
---

### Factory Method: `make`

The `make` static method provides a convenient way to create an instance of `OpenshockShockAction`.

```typescript
OpenshockShockAction.make(
    client: OpenshockClient,
    shockerIDs: string[] | ((handlerAgent: HandlerAgent, ...args: any) => string[]),
    intensity?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    duration?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    exclusive?: boolean | ((handlerAgent: HandlerAgent, ...args: any) => boolean)
): OpenshockShockAction
```

### Example Usage

#### Static Parameters

```typescript
const client = new OpenshockClient('API_TOKEN');

const handlers: JetstreamSubscriptionHandlers = {
    post: {
        c: [
            MessageHandler.make(
                [InputEqualsValidator.make('Hello')],
                [
                    OpenshockShockAction.make(
                        client,              // An instance of OpenshockClient
                        ['device1', 'device2'],  // Static list of shocker IDs
                        50,                  // Intensity: 50%
                        1000,                // Duration: 1 second
                        true,                // Exclusive mode enabled
                    )
                ],
                testAgent
            ),
        ],
    },
};
```

---

## OpenshockVibrateAction

### Overview

The `OpenshockVibrateAction` is designed to be an easier to use action for sending shocks

### Constructor Parameters

- **`client`**: An instance of `OpenshockClient` used to send commands to the connected devices.
- **`shockerIDs`**: A list of device IDs or a function to dynamically determine the IDs based on the `HandlerAgent`.
    - Type: `string[]` or `(handlerAgent: HandlerAgent, ...args: any) => string[]`
- **`intensity`**: The intensity level of the command, represented as a percentage between 0 and 100. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `25`
- **`duration`**: Duration of the command in milliseconds, which must be between 300 ms and 30000 ms. Can be a static value or a function to calculate it dynamically.
    - Type: `number` or `(handlerAgent: HandlerAgent, ...args: any) => number`
    - Default: `300`
- **`exclusive`**: A flag to determine if the control should be exclusive (i.e., no other actions overlapping). Can be static or dynamically determined.
    - Type: `boolean` or `(handlerAgent: HandlerAgent, ...args: any) => boolean`
    - Default: `true`
---

### Factory Method: `make`

The `make` static method provides a convenient way to create an instance of `OpenshockVibrateAction`.

```typescript
OpenshockVibrateAction.make(
    client: OpenshockClient,
    shockerIDs: string[] | ((handlerAgent: HandlerAgent, ...args: any) => string[]),
    intensity?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    duration?: number | ((handlerAgent: HandlerAgent, ...args: any) => number),
    exclusive?: boolean | ((handlerAgent: HandlerAgent, ...args: any) => boolean)
): OpenshockVibrateAction
```

### Example Usage

#### Static Parameters

```typescript
const client = new OpenshockClient('API_TOKEN');

const handlers: JetstreamSubscriptionHandlers = {
    post: {
        c: [
            MessageHandler.make(
                [InputEqualsValidator.make('Hello')],
                [
                    OpenshockVibrateAction.make(
                    client,              // An instance of OpenshockClient
                    ['device1', 'device2'],  // Static list of shocker IDs
                    50,                  // Intensity: 50%
                    1000,                // Duration: 1 second
                    true,                // Exclusive mode enabled
                )
                ],
                testAgent
            ),
        ],
    },
};
```
