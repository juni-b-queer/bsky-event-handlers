import {
    OpenshockControlDeviceAction,
    OpenshockShockAction,
    OpenshockVibrateAction,
    OpenshockClient,
    HandlerAgent,
    DebugLog,
    GotifySendMessage,
    GotifyClient,
} from '../../../../src';

describe('GotifySendMessage', () => {
    let action: GotifySendMessage;
    let handlerAgent: HandlerAgent;
    let client: GotifyClient;
    const mockSendMessage = jest.fn();
    const title: string = 'Test Title';
    const message: string = 'Test Message';
    const priority: number = 10;

    beforeEach(() => {
        client = {
            sendMessage: mockSendMessage,
        } as unknown as GotifyClient;

        handlerAgent = {} as unknown as HandlerAgent;

        jest.spyOn(DebugLog, 'info').mockImplementation(() => {});
        jest.spyOn(DebugLog, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should call sendMessage with correct parameters', async () => {
        action = GotifySendMessage.make(client, title, message, priority);
        mockSendMessage.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(mockSendMessage).toHaveBeenCalledWith(title, message, priority);

        expect(DebugLog.info).toHaveBeenCalledWith(
            'GOTIFY',
            'Successfully sent message'
        );

        expect(action.getClient()).toBe(client);
    });

    test('Should call sendMessage with correct parameters, default priority', async () => {
        action = GotifySendMessage.make(client, title, message);
        mockSendMessage.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(mockSendMessage).toHaveBeenCalledWith(title, message, 1);

        expect(DebugLog.info).toHaveBeenCalledWith(
            'GOTIFY',
            'Successfully sent message'
        );

        expect(action.getClient()).toBe(client);
    });

    test('should throw an error if sendControlRequest fails', async () => {
        action = GotifySendMessage.make(client, title, message, priority);
        mockSendMessage.mockResolvedValue(false);

        await action.handle(handlerAgent, {});

        expect(DebugLog.warn).toHaveBeenCalledWith(
            'GOTIFY',
            'Failed to send message'
        );
    });

    // it('Should handle exclusive parameter as false', async () => {
    //     exclusive = false;
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensity,
    //         duration,
    //         exclusive,
    //         controlType
    //     );
    //     mockSendControlRequest.mockResolvedValue(true);
    //
    //     await action.handle(handlerAgent, {});
    //
    //     expect(mockSendControlRequest).toHaveBeenCalledWith({
    //         customName: 'Bot Shock',
    //         shocks: [
    //             {
    //                 id: 'shocker1',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: false,
    //                 type: 'Shock',
    //             },
    //             {
    //                 id: 'shocker2',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: false,
    //                 type: 'Shock',
    //             },
    //         ],
    //     });
    // });
    //
    // it('Should handle exclusive parameter as function', async () => {
    //     const exclusiveFunc = jest.fn().mockReturnValue(true);
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensity,
    //         duration,
    //         exclusiveFunc,
    //         controlType
    //     );
    //     mockSendControlRequest.mockResolvedValue(true);
    //
    //     await action.handle(handlerAgent, {});
    //
    //     expect(exclusiveFunc).toHaveBeenCalledWith(handlerAgent, {});
    //     expect(mockSendControlRequest).toHaveBeenCalledWith({
    //         customName: 'Bot Shock',
    //         shocks: [
    //             {
    //                 id: 'shocker1',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: true,
    //                 type: 'Shock',
    //             },
    //             {
    //                 id: 'shocker2',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: true,
    //                 type: 'Shock',
    //             },
    //         ],
    //     });
    // });
    //
    // it('Should handle default parameters correctly', async () => {
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         undefined,
    //         undefined,
    //         undefined,
    //         undefined
    //     );
    //     mockSendControlRequest.mockResolvedValue(true);
    //
    //     await action.handle(handlerAgent, {});
    //
    //     expect(action['intensity']).toBe(25);
    //     expect(action['duration']).toBe(300);
    //     expect(action['exclusive']).toBe(true);
    //     expect(action['controlType']).toBe('Shock');
    // });
    //
    // it('Should throw an error if the duration is less than 300', () => {
    //     expect(() => {
    //         OpenshockControlDeviceAction.make(
    //             client,
    //             shockerIDs,
    //             intensity,
    //             200,
    //             exclusive,
    //             controlType
    //         );
    //     }).toThrow('Duration must be between 300 and 30000');
    // });
    //
    // it('Should throw an error if the intensity is less than 0 or greater than 100', () => {
    //     expect(() => {
    //         OpenshockControlDeviceAction.make(
    //             client,
    //             shockerIDs,
    //             -10,
    //             duration,
    //             exclusive,
    //             controlType
    //         );
    //     }).toThrow('Intensity must be a number between 0 and 100');
    //
    //     expect(() => {
    //         OpenshockControlDeviceAction.make(
    //             client,
    //             shockerIDs,
    //             110,
    //             duration,
    //             exclusive,
    //             controlType
    //         );
    //     }).toThrow('Intensity must be a number between 0 and 100');
    // });
    //
    //
    //
    // it('Should handle function-based parameters correctly', async () => {
    //     const intensityFunc = jest.fn().mockReturnValue(intensity);
    //     const durationFunc = jest.fn().mockReturnValue(duration);
    //     const exclusiveFunc = jest.fn().mockReturnValue(exclusive);
    //     const controlTypeFunc = jest.fn().mockReturnValue(controlType);
    //
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensityFunc,
    //         durationFunc,
    //         exclusiveFunc,
    //         controlTypeFunc
    //     );
    //     mockSendControlRequest.mockResolvedValue(true);
    //
    //     await action.handle(handlerAgent, {});
    //
    //     expect(intensityFunc).toHaveBeenCalledWith(handlerAgent, {});
    //     expect(durationFunc).toHaveBeenCalledWith(handlerAgent, {});
    //     expect(exclusiveFunc).toHaveBeenCalledWith(handlerAgent, {});
    //     expect(controlTypeFunc).toHaveBeenCalledWith(handlerAgent, {});
    //
    //     expect(mockSendControlRequest).toHaveBeenCalledWith({
    //         customName: 'Bot Shock',
    //         shocks: [
    //             {
    //                 id: 'shocker1',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: exclusive,
    //                 type: 'Shock',
    //             },
    //             {
    //                 id: 'shocker2',
    //                 intensity: 50,
    //                 duration: 500,
    //                 exclusive: exclusive,
    //                 type: 'Shock',
    //             },
    //         ],
    //     });
    // });
    //
    // it('should verify the correct data transformation in handle', async () => {
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensity,
    //         duration,
    //         exclusive,
    //         controlType
    //     );
    //     await action.handle(handlerAgent, {});
    //
    //     const [request] = mockSendControlRequest.mock.calls[0];
    //     request.shocks.forEach((shock: any, index: number) => {
    //         expect(shock.id).toBe(shockerIDs[index]);
    //         expect(shock.intensity).toBe(intensity);
    //         expect(shock.duration).toBe(duration);
    //         expect(shock.exclusive).toBe(exclusive);
    //         expect(shock.type).toBe(controlType);
    //     });
    // });
    //
    // it('generateStringArrayFromFunction should handle function input', () => {
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensity,
    //         duration,
    //         exclusive,
    //         controlType
    //     );
    //     const generateFn = (agent: HandlerAgent) => [
    //         'generated1',
    //         'generated2',
    //     ];
    //     const result = action.generateStringArrayFromFunction(
    //         generateFn,
    //         handlerAgent
    //     );
    //     expect(result).toEqual(['generated1', 'generated2']);
    // });
    //
    // it('generateStringArrayFromFunction should handle array input', () => {
    //     action = OpenshockControlDeviceAction.make(
    //         client,
    //         shockerIDs,
    //         intensity,
    //         duration,
    //         exclusive,
    //         controlType
    //     );
    //     const inputArray = ['direct1', 'direct2'];
    //     const result = action.generateStringArrayFromFunction(
    //         inputArray,
    //         handlerAgent
    //     );
    //     expect(result).toEqual(inputArray);
    // });
});

// describe('OpenshockShockAction', () => {
//     let client: OpenshockClient;
//
//     beforeEach(() => {
//         client = {} as unknown as OpenshockClient;
//     });
//
//     it('should create OpenshockShockAction with correct parameters and defaults', () => {
//         const action = OpenshockShockAction.make(client, ['shocker1']);
//         expect(action).toBeInstanceOf(OpenshockShockAction);
//         expect(action.getClient()).toBe(client);
//         expect(action['intensity']).toBe(1);
//         expect(action['duration']).toBe(300);
//         expect(action['exclusive']).toBe(true);
//         expect(action['controlType']).toBe('Shock');
//     });
// });
//
// describe('OpenshockVibrateAction', () => {
//     let client: OpenshockClient;
//
//     beforeEach(() => {
//         client = {} as unknown as OpenshockClient;
//     });
//
//     it('should create OpenshockVibrateAction with correct parameters and defaults', () => {
//         const action = OpenshockVibrateAction.make(client, ['shocker1']);
//         expect(action).toBeInstanceOf(OpenshockVibrateAction);
//         expect(action.getClient()).toBe(client);
//         expect(action['intensity']).toBe(1);
//         expect(action['duration']).toBe(300);
//         expect(action['exclusive']).toBe(true);
//         expect(action['controlType']).toBe('Vibrate');
//     });
// });
