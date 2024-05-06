import { nowDateTime } from "./time-utils";

export class DebugLog {
  static info(action: string, message: string) {
    DebugLog.log(action, message, "info");
  }

  static warn(action: string, message: string) {
    DebugLog.log(action, message, "warn");
  }

  static error(action: string, message: string) {
    DebugLog.log(action, message, "error");
  }

  static log(action: string, message: string, level: string = "info") {
    const debug: boolean = process.env.DEBUG_LOG_ACTIVE === "true";
    const debugLevel: string = process.env.DEBUG_LOG_LEVEL ?? "error";
    if (debug) {
      if (level === "error") {
        console.log(`${nowDateTime()} | ${action} | ERROR | ${message}`);
      }
      if (level === "warn") {
        if (debugLevel === "warn" || debugLevel === "info") {
          console.log(`${nowDateTime()} | ${action} | WARN | ${message}`);
        }
      }
      if (level == "info") {
        if (debugLevel === "info") {
          console.log(`${nowDateTime()} | ${action} | INFO | ${message}`);
        }
      }
    }
  }
}
