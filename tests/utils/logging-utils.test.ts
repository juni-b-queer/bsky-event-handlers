import { debugLog, nowDateTime } from "../../src";
import mocked = jest.mocked;

jest.mock("console", () => ({
  log: jest.fn(),
}));

describe("debugLog function test", () => {
  it("should not call console.log when debug is disabled", () => {
    const consoleSpy = jest.spyOn(console, "log");
    mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = "false";

    const action = "Action";
    const message = "Test message";

    debugLog(action, message);

    expect(consoleSpy).not.toHaveBeenCalled();
  });
  it("should call console.log with correct arguments when debug is enabled and error is false", () => {
    const consoleSpy = jest.spyOn(console, "log");
    mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = "true";

    const action = "Action";
    const message = "Test message";

    debugLog(action, message);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${nowDateTime()} | ${action} | ${message}`,
    );
  });

  it("should call console.log with correct arguments when debug is enabled and error is true", () => {
    const consoleSpy = jest.spyOn(console, "log");
    mocked(process.env, { shallow: true }).DEBUG_LOG_ACTIVE = "true";

    const action = "Action";
    const message = "Test message";

    debugLog(action, message, true);

    expect(consoleSpy).toHaveBeenCalledWith(
      `${nowDateTime()} | ${action} | ERROR | ${message}`,
    );
  });
});
