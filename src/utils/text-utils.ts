export function flattenTextUpdated(triggerKey: string, input: string) {
    if (!containsNumbers(triggerKey)) {
        input = removeNumbers(input)
    }
    if (!containsPunctuation(triggerKey)) {
        input = removePunctuation(input)
    }
    if (!containsSpaces(triggerKey)) {
        input = removeSpaces(input)
    }
    return input.toLowerCase();
}


export function removePunctuation(input: string) {
    return input.replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ")
}

export function removeNumbers(input: string) {
    return input.replace(/[0-9]/g, "");
}

export function removeSpaces(input: string) {
    return input.replace(" ", "");
}

export function containsNumbers(str: string) {
    return /\d/.test(str);
}

export function containsPunctuation(str: string) {
    return /\p{P}/gu.test(str);
}

export function containsSpaces(str: string) {
    return str.includes(" ");
}