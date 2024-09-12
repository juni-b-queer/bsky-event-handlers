import { AbstractAction } from '../../../actions/AbstractAction';
import { HandlerAgent } from '../../../agent/HandlerAgent';
import { OpenshockClient } from '../OpenshockClient';
import { DebugLog } from '../../../utils/DebugLog';

export type OpenshockControlSchema = {
    id: string;
    intensity: number;
    duration: number;
    type: 'Shock' | 'Vibrate';
    exclusive: boolean;
};

// TODO Write tests
export class OpenshockControlDeviceAction extends AbstractAction {
    constructor(
        protected client: OpenshockClient,
        protected shockerIDs:
            | string[]
            | ((arg0: HandlerAgent, ...args: any) => string[]),
        protected intensity:
            | number
            | ((arg0: HandlerAgent, ...args: any) => number) = 25,
        protected duration:
            | number
            | ((arg0: HandlerAgent, ...args: any) => number) = 300,
        protected exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true,
        protected controlType:
            | ((arg0: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate')
            | 'Shock'
            | 'Vibrate' = 'Shock'
    ) {
        if (typeof duration === 'number') {
            if (duration <= 300) {
                throw new Error('Duration must be between 300 and 30000');
            }
        }

        if (typeof intensity === 'number') {
            if (intensity < 0 || intensity > 100) {
                throw new Error('Intensity must be a number between 0 and 100');
            }
        }
        super();
    }

    static make(
        client: OpenshockClient,
        shockerIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        intensity: number | ((arg0: HandlerAgent, ...args: any) => number),
        duration: number | ((arg0: HandlerAgent, ...args: any) => number),
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true,
        controlType:
            | ((arg0: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate')
            | 'Shock'
            | 'Vibrate' = 'Shock'
    ): OpenshockControlDeviceAction {
        return new OpenshockControlDeviceAction(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive,
            controlType
        );
    }

    generateValueFromFunction(
        func: ((arg0: HandlerAgent, ...args: any) => any) | any,
        handlerAgent: HandlerAgent,
        ...args: any
    ): any {
        if (typeof func === 'function') {
            return func(handlerAgent, ...args);
        }
        return func;
    }
    generateBooleanFromFunction(
        func: ((arg0: HandlerAgent, ...args: any) => boolean) | boolean,
        handlerAgent: HandlerAgent,
        ...args: any
    ): boolean {
        if (typeof func === 'function') {
            return func(handlerAgent, ...args);
        }
        return func;
    }

    generateNumberFromFunction(
        func: ((arg0: HandlerAgent, ...args: any) => number) | number,
        handlerAgent: HandlerAgent,
        ...args: any
    ): number {
        if (typeof func === 'function') {
            return func(handlerAgent, ...args);
        }
        return func;
    }

    generateStringFromFunction(
        func: ((arg0: HandlerAgent, ...args: any) => string) | string,
        handlerAgent: HandlerAgent,
        ...args: any
    ): string {
        if (typeof func === 'function') {
            return func(handlerAgent, ...args);
        }
        return func;
    }

    generateStringArrayFromFunction(
        func: ((arg0: HandlerAgent, ...args: any) => string[]) | string[],
        handlerAgent: HandlerAgent,
        ...args: any
    ): string[] {
        if (typeof func === 'function') {
            return func(handlerAgent, ...args);
        }
        return func;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        console.log(this.shockerIDs);
        const shocks = this.generateShocks(handlerAgent, ...args);
        const body = {
            customName: 'Bot Shock',
            shocks: shocks,
        };
        const res = await this.client.sendControlRequest(body);
        console.log(res);
        if (res) {
            DebugLog.debug('OPENSHOCK', 'Successfully sent control request');
        } else {
            DebugLog.warn('OPENSHOCK', 'Failed to send control request');
        }
    }

    protected generateShocks(
        handlerAgent: HandlerAgent,
        ...args: any
    ): OpenshockControlSchema[] {
        const shocks: OpenshockControlSchema[] = [];
        const generatedShockerIds = this.generateStringArrayFromFunction(
            this.shockerIDs,
            handlerAgent,
            ...args
        );

        const generatedDuration = this.generateNumberFromFunction(
            this.duration,
            handlerAgent,
            ...args
        );

        const generatedIntensity = this.generateNumberFromFunction(
            this.intensity,
            handlerAgent,
            ...args
        );

        const generatedExclusive = this.generateBooleanFromFunction(
            this.exclusive,
            handlerAgent,
            ...args
        );

        const generatedControlType = this.generateValueFromFunction(
            this.controlType,
            handlerAgent,
            ...args
        );

        generatedShockerIds.forEach((id: string) => {
            const shock: OpenshockControlSchema = {
                id: id,
                intensity: generatedIntensity,
                duration: generatedDuration,
                type: generatedControlType,
                exclusive: generatedExclusive,
            };
            shocks.push(shock);
        });

        return shocks;
    }
}

// TODO Write tests
export class OpenshockShockAction extends OpenshockControlDeviceAction {
    constructor(
        client: OpenshockClient,
        shockerIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        intensity: number | ((arg0: HandlerAgent, ...args: any) => number) = 25,
        duration: number | ((arg0: HandlerAgent, ...args: any) => number) = 300,
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
    ) {
        super(client, shockerIDs, intensity, duration, exclusive, 'Shock');
    }

    static make(
        client: OpenshockClient,
        shockerIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        intensity: number | ((arg0: HandlerAgent, ...args: any) => number),
        duration: number | ((arg0: HandlerAgent, ...args: any) => number),
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
    ): OpenshockShockAction {
        return new OpenshockShockAction(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive
        );
    }
}

// TODO Write tests
export class OpenshockVibrateAction extends OpenshockControlDeviceAction {
    constructor(
        client: OpenshockClient,
        shockerIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        intensity: number | ((arg0: HandlerAgent, ...args: any) => number) = 25,
        duration: number | ((arg0: HandlerAgent, ...args: any) => number) = 300,
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
    ) {
        super(client, shockerIDs, intensity, duration, exclusive, 'Vibrate');
    }

    static make(
        client: OpenshockClient,
        shockerIDs: string[] | ((arg0: HandlerAgent, ...args: any) => string[]),
        intensity: number | ((arg0: HandlerAgent, ...args: any) => number),
        duration: number | ((arg0: HandlerAgent, ...args: any) => number),
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
    ): OpenshockVibrateAction {
        return new OpenshockVibrateAction(
            client,
            shockerIDs,
            intensity,
            duration,
            exclusive
        );
    }
}
