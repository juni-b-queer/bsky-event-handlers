import { DebugLog } from '../../utils/DebugLog';

export class GotifyClient {
    constructor(
        private apiToken: string,
        private baseUrl: string
    ) {}

    public async sendMessage(
        title: string,
        message: string,
        priority: number = 1
    ): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/message`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                message: message,
                priority: priority,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            },
        });
        if (response.status !== 200) {
            DebugLog.warn(
                'GOTIFY CLIENT',
                JSON.stringify((await response.json()).errors, null, 2)
            );
            return false;
        }
        return response.status === 200;
    }
}
