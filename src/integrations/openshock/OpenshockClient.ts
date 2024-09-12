import { OpenshockControlSchema } from './actions/OpenshockActions';
import { DebugLog } from '../../utils/DebugLog';

export class OpenshockClient {
    public BASE_URL: string = 'https://api.openshock.app';
    constructor(
        private apiToken: string,
        baseUrl: string | undefined
    ) {
        if (typeof baseUrl === 'string') {
            this.BASE_URL = baseUrl;
        }
    }

    public async sendControlRequest(requestBody: {
        customName: string;
        shocks: OpenshockControlSchema[];
    }): Promise<boolean> {
        const response = await fetch(`${this.BASE_URL}/2/shockers/control`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                OpenShockToken: this.apiToken,
            },
        });
        if (response.status !== 200) {
            // console.log(response.body);
            DebugLog.warn(
                'OPENSHOCK CLIENT',
                JSON.stringify((await response.json()).errors, null, 2)
            );
            return false;
        }
        return response.status === 200;
    }
}
