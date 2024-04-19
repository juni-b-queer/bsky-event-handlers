import {
  CreateSkeetMessage,
  HandlerAgent,
  InputIsCommandValidator,
  Subject,
} from "../../../src";

describe("InputIsCommandValidator Class", () => {
  let inputIsCommandValidator: InputIsCommandValidator;
  // @ts-ignore
  let message: CreateSkeetMessage = {
    collection: "",
    did: "",
    opType: "",
    rkey: "",
    seq: 0,
    record: {
      text: "test",
      $type: "",
      createdAt: "",
      subject: {} as Subject,
    },
  };
  const handlerAgent: HandlerAgent = {} as HandlerAgent;

  beforeEach(() => {
    inputIsCommandValidator = new InputIsCommandValidator("key");
  });

  it("should test shouldTrigger function - Prefix case", async () => {
    // @ts-ignore
    message.record.text = "!key someCommand";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(true);

    // @ts-ignore
    message.record.text = "!key";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(true);

    // @ts-ignore
    message.record.text = "someCommand !key";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(false);

    // @ts-ignore
    message.record.text = "someCommand";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(false);
  });

  it("should test shouldTrigger function - Suffix case", async () => {
    // @ts-ignore
    message.record.text = "key! someCommand";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(true);

    // @ts-ignore
    message.record.text = "key!";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(true);

    // @ts-ignore
    message.record.text = "someCommand key!";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(false);

    // @ts-ignore
    message.record.text = "someCommand";
    expect(
      await inputIsCommandValidator.shouldTrigger(message, handlerAgent),
    ).toBe(false);
  });
});
