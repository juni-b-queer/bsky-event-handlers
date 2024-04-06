import { advanceTo, clear } from "jest-date-mock";
import { getHumanReadableDateTimeStamp, nowDateTime } from "../../src";

describe("getHumanReadableDateTimeStamp", () => {
  it("should return date time string in human readable format", () => {
    const datetime = "2023-11-30T15:31:00";
    const result = getHumanReadableDateTimeStamp(datetime);
    expect(result).toEqual(expect.any(String));
  });

  it("should handle incorrect datetime by throwing an error", () => {
    const datetime = "incorrect-date-time";
    expect(getHumanReadableDateTimeStamp(datetime)).toBe("Invalid Date");
  });

  it("should correctly handle date times near midnight", () => {
    const datetime = "2023-11-30T23:59:59";
    const result = getHumanReadableDateTimeStamp(datetime);
    expect(result).toEqual(expect.any(String));
  });
});
describe("nowDateTime function", () => {
  beforeEach(() => {
    advanceTo(new Date(Date.UTC(2023, 3, 2, 19, 30, 0)));
  });
  afterEach(() => {
    clear();
  });

  it("should return the correct datetime string", () => {
    const result = nowDateTime();
    expect(result).toBe("4/2/2023, 02:30 PM");
  });
});
