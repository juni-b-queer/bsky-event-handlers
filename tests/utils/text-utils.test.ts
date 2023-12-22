import {
    containsNumbers,
    containsPunctuation,
    containsSpaces,
    flattenTextUpdated, removeNumbers, removePunctuation,
    removeSpaces,
    trimCommandInput
} from "../../src";

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

describe('flattenTextUpdated function', () => {
    test('it should return text without numbers if triggerKey does not contain numbers', () => {
        const triggerKey = 'abcd';
        const input = 'abc1234';
        expect(flattenTextUpdated(triggerKey, input)).toEqual('abc');
    });

    test('it should return text without punctuation if triggerKey does not contain punctuation', () => {
        const triggerKey = 'abcd';
        const input = 'abc,134!';
        expect(flattenTextUpdated(triggerKey, input)).toEqual('abc');
    });

    test('it should return text without spaces or numbers if triggerKey does not contain spaces or numbers', () => {
        const triggerKey = 'abcd';
        const input = 'abc 134';
        expect(flattenTextUpdated(triggerKey, input)).toEqual('abc');
    });

    test('it should return text with numbers if triggerKey does contain numbers', () => {
        const triggerKey = 'abcd1';
        const input = 'abc 134';
        expect(flattenTextUpdated(triggerKey, input)).toEqual('abc134');
    });

    test('it should return all lowercase text', () => {
        const triggerKey = 'abcd';
        const input = 'ABC';
        expect(flattenTextUpdated(triggerKey, input)).toEqual('abc');
    });
});
describe('removePunctuation', () => {
    it('should remove all punctuations from a string and replace multiple spaces with a single space', () => {
        const testString = 'Hello, World! How\'s it going...'
        const expectedOutput = 'Hello World How\'s it going'
        expect(removePunctuation(testString)).toBe(expectedOutput);
    });

    it('should return the same string if there are no punctuations and multiple spaces', () => {
        const testString = 'Hello World'
        const expectedOutput = 'Hello World'
        expect(removePunctuation(testString)).toBe(expectedOutput);
    });

    it('should handle empty string correctly', () => {
        const testString = ''
        const expectedOutput = ''
        expect(removePunctuation(testString)).toBe(expectedOutput);
    });

    it('should handle string with only punctuations and spaces correctly', () => {
        const testString = '!'
        const expectedOutput = ''
        expect(removePunctuation(testString)).toBe(expectedOutput);
    });
});

describe('removeNumbers', () => {
    it('should correctly remove all numeric characters from the input string', () => {
        const result = removeNumbers("Hello123");
        expect(result).toBe("Hello");
    });

    it('should return the same string if there are no numeric characters', () => {
        const result = removeNumbers("Hello");
        expect(result).toBe("Hello");
    });

    it('should return an empty string if the input string only consists of numeric characters', () => {
        const result = removeNumbers("1234567890");
        expect(result).toBe("");
    });

    it('should return an empty string if the input string is empty', () => {
        const result = removeNumbers("");
        expect(result).toBe("");
    });
});

describe('removeSpaces function', () => {
    it('should remove all spaces from given string', () => {
        expect(removeSpaces('Hello World')).toBe('HelloWorld');
    });

    it('should return the same string when there are no spaces', () => {
        expect(removeSpaces('Hello')).toBe('Hello');
    });

    it('should return empty string when input is only space characters', () => {
        expect(removeSpaces('     ')).toBe('');
    });
});
describe('Testing the function containsNumbers from the text-utils module', () => {
    test('should check if the string contains any number', () => {
        expect(containsNumbers('Hello')).toBe(false);
        expect(containsNumbers('123')).toBe(true);
        expect(containsNumbers('Hello123')).toBe(true);
        expect(containsNumbers('')).toBe(false);
    });
});

describe('containsPunctuation', () => {
    it('should return true if a string contains punctuation', () => {
        const testString = 'Hello, world!';
        expect(containsPunctuation(testString)).toBe(true);
    });

    it('should return false if a string does not contain punctuation', () => {
        const testString = 'Hello world';
        expect(containsPunctuation(testString)).toBe(false);
    });

    it('should return false if given an empty string', () => {
        const testString = '';
        expect(containsPunctuation(testString)).toBe(false);
    });
});

describe("containsSpaces function", () => {
    test("should return true if the input string contains spaces", () => {
        const input = "Hello World";
        const output = containsSpaces(input);
        expect(output).toBe(true);
    });

    test("should return false if the input string does not contain spaces", () => {
        const input = "HelloWorld";
        const output = containsSpaces(input);
        expect(output).toBe(false);
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
        let input = `hi 1 hour, 30 minutes`
        expect(trimCommandInput(input, command)).toBe(false);
    });
});