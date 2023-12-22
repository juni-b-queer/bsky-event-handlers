import { flattenTextUpdated, trimCommandInput } from "../../src";

describe("flattenTextUpdated Handles keys", () => {
    test("Key contains Spaces, Keeps spaces", () => {
        let key = "well actually"
        let input = "well actually"
        let expected = "well actually"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });
    test("Key does not contain Spaces, remove spaces", () => {
        let key = "wellactually"
        let input = "well actually"
        let expected = "wellactually"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });

    test("Key contains Numbers, Keeps Numbers", () => {
        let key = "well1"
        let input = "well1"
        let expected = "well1"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });
    test("Key does not contain Numbers, remove Numbers", () => {
        let key = "well"
        let input = "well1"
        let expected = "well"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });

    test("Key contains Punctuation, Keeps Punctuation", () => {
        let key = "well!"
        let input = "well!"
        let expected = "well!"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });
    test("Key does not contain Punctuation, remove Punctuation", () => {
        let key = "well"
        let input = "well!"
        let expected = "well"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });

    test("Key contains All, Keeps All", () => {
        let key = "keywith all ! 10"
        let input = "well! a random number 100"
        let expected = "well! a random number 100"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });
    test("Key does not contain Any, remove All", () => {
        let key = "well"
        let input = "well!1 hello"
        let expected = "wellhello"
        expect(flattenTextUpdated(key, input)).toBe(expected);
    });

});


describe("Trim Command From Input", () => {
    let command = "TestCommand";
    let arbitraryText = 'hello world this is june'
    test("!{command} in front removes and trims", () => {
        let input = `!${command} ${arbitraryText}`
        expect(trimCommandInput(input, command)).toBe(arbitraryText);
    });
    test("{command}! removes and trims", () => {
        let input = `${command}! ${arbitraryText}`
        expect(trimCommandInput(input, command)).toBe(arbitraryText);
    });

    test("!{command} with additional command", () => {
        let input = `!${command} ${arbitraryText} !${command}`
        expect(trimCommandInput(input, command)).toBe(`${arbitraryText} !${command.toLowerCase()}`);
    });
    test("{command}! with time string", () => {
        let input = `${command}! 1 hour, 30 minutes`
        expect(trimCommandInput(input, command)).toBe('1 hour, 30 minutes');
    });

    test("Invalid input returns false", () => {
        let input = `${command}! 1 hour, 30 minutes`
        expect(trimCommandInput(input, command)).toBe('1 hour, 30 minutes');
    });
});