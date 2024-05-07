export function flattenTextUpdated(triggerKey: string, input: string) {
    if (!containsNumbers(triggerKey)) {
        input = removeNumbers(input);
    }
    if (!containsPunctuation(triggerKey)) {
        input = removePunctuation(input);
    }
    if (!containsSpaces(triggerKey)) {
        input = removeSpaces(input);
    }
    return input.toLowerCase();
}

export function removePunctuation(input: string) {
    return input
        .replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s{2,}/g, ' ');
}

export function removeNumbers(input: string) {
    return input.replace(/[0-9]/g, '');
}

export function removeSpaces(input: string) {
    return input.replaceAll(' ', '');
}

export function containsNumbers(str: string) {
    return /\d/.test(str);
}

export function containsPunctuation(str: string) {
    return /\p{P}/gu.test(str);
}

export function containsSpaces(str: string) {
    return str.includes(' ');
}

export function trimCommandInput(
    input: string,
    command: string
): string | boolean {
    input = input.toLowerCase();
    command = command.toLowerCase();
    if (input.startsWith(`!${command}`)) {
        return input.replace(`!${command}`, '').trim().toLowerCase();
    } else if (input.startsWith(`${command}!`)) {
        return input.replace(`${command}!`, '').trim().toLowerCase();
    } else {
        return false;
    }
}

export function isGoodBotResponse(input: string): boolean {
    const positiveConnotationWords: string[] = [
        'great',
        'good',
        'fantastic',
        'excellent',
        'awesome',
        'positive',
        'amazing',
        'incredible',
        'super',
    ];
    const words = removePunctuation(input.toLowerCase()).split(' ');

    if (words[1] === 'bot') {
        if (positiveConnotationWords.includes(words[0])) {
            return true;
        }
    }
    return input.toLowerCase().includes('thank you');
}

export function isBadBotResponse(input: string): boolean {
    const negativeConnotationWords: string[] = [
        'bad',
        'dumb',
        'stupid',
        'useless',
        'annoying',
        'shitty',
    ];
    const words = removePunctuation(input.toLowerCase()).split(' ');

    if (words[1] === 'bot') {
        if (negativeConnotationWords.includes(words[0])) {
            return true;
        }
    }

    return false;
}
