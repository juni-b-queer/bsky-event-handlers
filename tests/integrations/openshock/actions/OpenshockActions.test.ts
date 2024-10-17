import {
    OpenshockControlDeviceAction,
    OpenshockShockAction,
    OpenshockVibrateAction,
    OpenshockClient,
    HandlerAgent,
    DebugLog,
} from '../../../../src';

describe('OpenshockControlDeviceAction', () => {
    let action: OpenshockControlDeviceAction;
    let handlerAgent: HandlerAgent;
    let client: OpenshockClient;
    const mockSendControlRequest = jest.fn();
    const shockerIDs: string[] = ['shocker1', 'shocker2'];
    const intensity: number = 50;
    const duration: number = 500;
    let exclusive: boolean | ((arg0: HandlerAgent, ...args: any) => boolean);
    const controlType: 'Shock' | 'Vibrate' = 'Shock';

    beforeEach(() => {
        client = {
            sendControlRequest: mockSendControlRequest,
        } as unknown as OpenshockClient;

        handlerAgent = {} as unknown as HandlerAgent;

        jest.spyOn(DebugLog, 'debug').mockImplementation(() => {});
        jest.spyOn(DebugLog, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call sendControlRequest with correct parameters', async () => {
        exclusive = true;
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(mockSendControlRequest).toHaveBeenCalledWith({
            customName: 'Bot Shock',
            shocks: [
                {
                    id: 'shocker1',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
                {
                    id: 'shocker2',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
            ],
        });
    });

    it('Should handle exclusive parameter as true', async () => {
        exclusive = true;
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(mockSendControlRequest).toHaveBeenCalledWith({
            customName: 'Bot Shock',
            shocks: [
                {
                    id: 'shocker1',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
                {
                    id: 'shocker2',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
            ],
        });
    });

    it('Should handle exclusive parameter as false', async () => {
        exclusive = false;
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(mockSendControlRequest).toHaveBeenCalledWith({
            customName: 'Bot Shock',
            shocks: [
                {
                    id: 'shocker1',
                    intensity: 50,
                    duration: 500,
                    exclusive: false,
                    type: 'Shock',
                },
                {
                    id: 'shocker2',
                    intensity: 50,
                    duration: 500,
                    exclusive: false,
                    type: 'Shock',
                },
            ],
        });
    });

    it('Should handle exclusive parameter as function', async () => {
        const exclusiveFunc = jest.fn().mockReturnValue(true);
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusiveFunc,
            controlType
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(exclusiveFunc).toHaveBeenCalledWith(handlerAgent, {});
        expect(mockSendControlRequest).toHaveBeenCalledWith({
            customName: 'Bot Shock',
            shocks: [
                {
                    id: 'shocker1',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
                {
                    id: 'shocker2',
                    intensity: 50,
                    duration: 500,
                    exclusive: true,
                    type: 'Shock',
                },
            ],
        });
    });

    it('Should handle default parameters correctly', async () => {
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            undefined,
            undefined,
            undefined,
            undefined
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(action['intensity']).toBe(25);
        expect(action['duration']).toBe(300);
        expect(action['exclusive']).toBe(true);
        expect(action['controlType']).toBe('Shock');
    });

    it('Should throw an error if the duration is less than 300', () => {
        expect(() => {
            OpenshockControlDeviceAction.make(
                client,
                shockerIDs,
                intensity,
                200,
                exclusive,
                controlType
            );
        }).toThrow('Duration must be between 300 and 30000');
    });

    it('Should throw an error if the intensity is less than 0 or greater than 100', () => {
        expect(() => {
            OpenshockControlDeviceAction.make(
                client,
                shockerIDs,
                -10,
                duration,
                exclusive,
                controlType
            );
        }).toThrow('Intensity must be a number between 0 and 100');

        expect(() => {
            OpenshockControlDeviceAction.make(
                client,
                shockerIDs,
                110,
                duration,
                exclusive,
                controlType
            );
        }).toThrow('Intensity must be a number between 0 and 100');
    });

    it('should throw an error if sendControlRequest fails', async () => {
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        mockSendControlRequest.mockResolvedValue(false);

        await action.handle(handlerAgent, {});

        expect(DebugLog.warn).toHaveBeenCalledWith(
            'OPENSHOCK',
            'Failed to send control request'
        );
    });

    it('Should handle function-based parameters correctly', async () => {
        const intensityFunc = jest.fn().mockReturnValue(intensity);
        const durationFunc = jest.fn().mockReturnValue(duration);
        const exclusiveFunc = jest.fn().mockReturnValue(exclusive);
        const controlTypeFunc = jest.fn().mockReturnValue(controlType);

        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensityFunc,
            durationFunc,
            exclusiveFunc,
            controlTypeFunc
        );
        mockSendControlRequest.mockResolvedValue(true);

        await action.handle(handlerAgent, {});

        expect(intensityFunc).toHaveBeenCalledWith(handlerAgent, {});
        expect(durationFunc).toHaveBeenCalledWith(handlerAgent, {});
        expect(exclusiveFunc).toHaveBeenCalledWith(handlerAgent, {});
        expect(controlTypeFunc).toHaveBeenCalledWith(handlerAgent, {});

        expect(mockSendControlRequest).toHaveBeenCalledWith({
            customName: 'Bot Shock',
            shocks: [
                {
                    id: 'shocker1',
                    intensity: 50,
                    duration: 500,
                    exclusive: exclusive,
                    type: 'Shock',
                },
                {
                    id: 'shocker2',
                    intensity: 50,
                    duration: 500,
                    exclusive: exclusive,
                    type: 'Shock',
                },
            ],
        });
    });

    it('should verify the correct data transformation in handle', async () => {
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        await action.handle(handlerAgent, {});

        const [request] = mockSendControlRequest.mock.calls[0];
        request.shocks.forEach((shock: any, index: number) => {
            expect(shock.id).toBe(shockerIDs[index]);
            expect(shock.intensity).toBe(intensity);
            expect(shock.duration).toBe(duration);
            expect(shock.exclusive).toBe(exclusive);
            expect(shock.type).toBe(controlType);
        });
    });

    it('generateStringArrayFromFunction should handle function input', () => {
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        const generateFn = (agent: HandlerAgent) => [
            'generated1',
            'generated2',
        ];
        const result = action.generateStringArrayFromFunction(
            generateFn,
            handlerAgent
        );
        expect(result).toEqual(['generated1', 'generated2']);
    });

    it('generateStringArrayFromFunction should handle array input', () => {
        action = OpenshockControlDeviceAction.make(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
        const inputArray = ['direct1', 'direct2'];
        const result = action.generateStringArrayFromFunction(
            inputArray,
            handlerAgent
        );
        expect(result).toEqual(inputArray);
    });
});

describe('OpenshockShockAction', () => {
    let client: OpenshockClient;

    beforeEach(() => {
        client = {} as unknown as OpenshockClient;
    });

    it('should create OpenshockShockAction with correct parameters and defaults', () => {
        const action = OpenshockShockAction.make(client, ['shocker1']);
        expect(action).toBeInstanceOf(OpenshockShockAction);
        expect(action.getClient()).toBe(client);
        expect(action['intensity']).toBe(1);
        expect(action['duration']).toBe(300);
        expect(action['exclusive']).toBe(true);
        expect(action['controlType']).toBe('Shock');
    });
});

describe('OpenshockVibrateAction', () => {
    let client: OpenshockClient;

    beforeEach(() => {
        client = {} as unknown as OpenshockClient;
    });

    it('should create OpenshockVibrateAction with correct parameters and defaults', () => {
        const action = OpenshockVibrateAction.make(client, ['shocker1']);
        expect(action).toBeInstanceOf(OpenshockVibrateAction);
        expect(action.getClient()).toBe(client);
        expect(action['intensity']).toBe(1);
        expect(action['duration']).toBe(300);
        expect(action['exclusive']).toBe(true);
        expect(action['controlType']).toBe('Vibrate');
    });
});
