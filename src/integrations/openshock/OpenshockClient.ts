import { OpenshockControlSchema } from './actions/OpenshockActions';
import { DebugLog } from '../../utils/DebugLog';

type RequestOptions = {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: { [key: string]: string };
    body?: string;
};

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
            DebugLog.warn(
                'OPENSHOCK CLIENT',
                JSON.stringify((await response.json()).errors, null, 2)
            );
            return false;
        }
        return response.status === 200;
    }

    public async sendApiV1Request(
        method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH',
        route: string,
        requestBody: object | undefined = undefined
    ) {
        const reqOptions: RequestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                OpenShockToken: this.apiToken,
            },
        };
        if (
            requestBody !== undefined &&
            (method === 'POST' || method === 'PUT' || method === 'PATCH')
        ) {
            reqOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(`${this.BASE_URL}/1/${route}`, reqOptions);

        const responseBody = await response.json();

        if (response.status !== 200) {
            DebugLog.warn(
                'OPENSHOCK CLIENT',
                JSON.stringify(responseBody?.errors, null, 2)
            );
            return responseBody.errors;
        }

        return responseBody.data;
    }

    /**
     * Shockers
     */
    public async getShockers(
        ownership: 'own' | 'shared' = 'own',
        hubId: string | undefined = undefined
    ) {
        const responseData = await this.sendApiV1Request(
            'GET',
            `shockers/${ownership}`
        );

        // Transform the responseData to the desired format
        const mappedShockers = responseData
            .filter((hub: any) => {
                if (hubId === undefined) {
                    return true;
                }

                return hubId === hub.id;
            })
            .flatMap((hub: any) =>
                hub.shockers.map((shocker: any) => ({
                    name: shocker.name,
                    id: shocker.id,
                    controllerId: hub.id,
                    controllerName: hub.name,
                }))
            );

        // Example usage of the transformed data
        return mappedShockers;
    }

    public async getOwnedShockersFromNames(...names: string[]) {
        const shockers = await this.getShockers('own');
        return shockers.filter((shocker: any) => names.includes(shocker.name));
    }

    public async getShockerIDFromName(name: string) {
        let shockers = await this.getShockers('own');
        shockers = shockers.filter((shocker: any) => {
            return shocker.name === name;
        });
        return shockers[0]?.id || null;
    }

    /**
     * Devices/Hubs
     */

    /**
     * Shares
     */
}
