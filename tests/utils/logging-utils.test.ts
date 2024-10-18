import { debugLog, nowDateTime } from '../../src';
import mocked = jest.mocked;

jest.mock('console', () => ({
    log: jest.fn(),
}));

describe('debugLog function test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should not call console.log when debug is disabled', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'false';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message);

        expect(consoleSpy).not.toHaveBeenCalled();
    });
    it('should call console.log with info when debug is enabled and level is info', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message, 'info');

        expect(consoleSpy).toHaveBeenCalledWith(
            `${nowDateTime()} | ${action} | INFO | ${message}`
        );
    });

    it('should not call console.log with info when debug is enabled and level is warn', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'warn';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message, 'info');

        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should call console.log with warn when debug is enabled and level is warn', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'warn';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message, 'warn');

        expect(consoleSpy).toHaveBeenCalledWith(
            `${nowDateTime()} | ${action} | WARN | ${message}`
        );
    });

    it('should call console.log with warn when debug is enabled and level is info', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';
        mocked(process.env, { shallow: true }).DEBUG_LOG_LEVEL = 'info';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message, 'warn');

        expect(consoleSpy).toHaveBeenCalledWith(
            `${nowDateTime()} | ${action} | WARN | ${message}`
        );
    });

    it('should call console.log with correct arguments when debug is enabled and error is true', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = 'true';

        const action = 'Action';
        const message = 'Test message';

        debugLog(action, message, 'error');

        expect(consoleSpy).toHaveBeenCalledWith(
            `${nowDateTime()} | ${action} | ERROR | ${message}`
        );
    });
});
