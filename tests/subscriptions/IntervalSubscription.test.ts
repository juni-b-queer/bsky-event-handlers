// Mocking AbstractHandler
import {
    AbstractHandler,
    AbstractMessageAction,
    AbstractValidator,
    HandlerAgent,
    IntervalSubscription,
    IntervalSubscriptionHandlers,
} from '../../src';

// Mock Class
class MockHandler extends AbstractHandler {
    handle = jest.fn();
}

describe('IntervalSubscriptions', function () {
    const mockedHandlerAgent: HandlerAgent = {} as HandlerAgent;
    const mockValidatorShouldTrigger = jest.fn().mockReturnValue(true);
    const mockActionHandle = jest.fn();
    const mockedValidators: AbstractValidator[] = [
        {
            shouldTrigger: mockValidatorShouldTrigger,
        } as unknown as AbstractValidator,
    ];
    const mockedActions: AbstractMessageAction[] = [
        {
            handle: mockActionHandle,
        } as unknown as AbstractMessageAction,
    ];
    let intervalSubs: IntervalSubscription;

    const handler = new MockHandler(
        mockedValidators,
        mockedActions,
        mockedHandlerAgent
    );
    const intervalHandlers: IntervalSubscriptionHandlers = [
        {
            intervalSeconds: 1,
            handlers: [handler],
        },
    ];

    let mockSetInterval: jest.SpyInstance;
    let mockClearInterval: jest.SpyInstance;

    beforeEach(() => {
        intervalSubs = new IntervalSubscription(intervalHandlers);
        mockSetInterval = jest.spyOn(global, 'setInterval');
        mockClearInterval = jest.spyOn(global, 'clearInterval');
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks(); // clear all function calls between tests
    });

    // ...

    describe('createSubscription', function () {
        // ...

        it('should call the handler handle function for each handler after each interval', () => {
            intervalSubs.createSubscription();

            // Advance timers to imitate the passage of time
            jest.advanceTimersByTime(
                intervalHandlers[0].intervalSeconds * 1000
            );

            // Assert that handle has been called with `undefined`
            expect(handler.handle).toHaveBeenCalledWith(undefined);
        });
    });

    describe('stopSubscription', function () {
        it('should stop the intervals for subscription', () => {
            intervalSubs.createSubscription();
            jest.advanceTimersByTime(
                intervalHandlers[0].intervalSeconds * 1000
            );
            intervalSubs.stopSubscription();

            // Check that intervals have been cleared
            expect(intervalSubs.intervals.length).toBe(0);

            // Assert that handle has been called only once before stopSubscription
            expect(handler.handle).toHaveBeenCalledTimes(1);
        });
    });

    describe('restartSubscription', function () {
        it('should stop and then start the subscription', () => {
            // Prepare spies for methods
            const stopSpy = jest.spyOn(intervalSubs, 'stopSubscription');
            const startSpy = jest.spyOn(intervalSubs, 'createSubscription');

            intervalSubs.createSubscription();
            jest.runOnlyPendingTimers();
            expect(handler.handle).toHaveBeenCalledTimes(1);

            // Call the method under test
            intervalSubs.restartSubscription();

            // Check that both methods were called
            expect(stopSpy).toHaveBeenCalledTimes(1);
            expect(startSpy).toHaveBeenCalledTimes(2); // At the beginning and after restartSubscription

            jest.runOnlyPendingTimers();
            // Assert that handle has been called twice (once before restart and once after)
            expect(handler.handle).toHaveBeenCalledTimes(2);
        });
    });
});
