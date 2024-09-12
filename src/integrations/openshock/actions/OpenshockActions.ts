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
        protected controlType:
            | ((arg0: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate')
            | 'Shock'
            | 'Vibrate' = 'Shock',
        protected exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
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
        controlType:
            | ((arg0: HandlerAgent, ...args: any) => 'Shock' | 'Vibrate')
            | 'Shock'
            | 'Vibrate' = 'Shock',
        exclusive:
            | boolean
            | ((arg0: HandlerAgent, ...args: any) => boolean) = true
    ): OpenshockControlDeviceAction {
        return new OpenshockControlDeviceAction(
            client,
            shockerIDs,
            intensity,
            duration,
            controlType,
            exclusive
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  @typescript-eslint/no-explicit-any
    async handle(handlerAgent: HandlerAgent, ...args: any): Promise<any> {
        DebugLog.warn('OPENSHOCK', 'HANDLE');
        const shocks = this.generateShocks(handlerAgent, ...args);
        const body = {
            customName: 'Bot Shock',
            shocks: shocks,
        };
        const res = await this.client.sendControlRequest(body);
        if (res) {
            DebugLog.debug('OPENSHOCK', 'Successfully sent control request');
        } else {
            DebugLog.warn('OPENSHOCK', 'Failed to send control request');
        }
    }

    private generateShocks(
        handlerAgent: HandlerAgent,
        ...args: any
    ): OpenshockControlSchema[] {
        const shocks: OpenshockControlSchema[] = [];
        let generatedShockerIds;
        if (typeof this.shockerIDs === 'function') {
            generatedShockerIds = this.shockerIDs(handlerAgent, ...args);
        } else {
            generatedShockerIds = this.shockerIDs;
        }

        let generatedDuration;
        if (typeof this.duration == 'function') {
            generatedDuration = this.duration(handlerAgent, ...args);
        } else {
            generatedDuration = this.duration;
        }

        let generatedIntensity;
        if (typeof this.intensity == 'function') {
            generatedIntensity = this.intensity(handlerAgent, ...args);
        } else {
            generatedIntensity = this.intensity;
        }

        let generatedExclusive;
        if (typeof this.exclusive == 'function') {
            generatedExclusive = this.exclusive(handlerAgent, ...args);
        } else {
            generatedExclusive = this.exclusive;
        }

        let generatedControlType;
        if (typeof this.controlType == 'function') {
            generatedControlType = this.controlType(handlerAgent, ...args);
        } else {
            generatedControlType = this.controlType;
        }

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
