export function getHumanReadableDateTimeStamp(datetime: string) {
    let dateObject = new Date(datetime)
    return dateObject.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        hour12: true, // Use 24-hour time format
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function nowDateTime() {
    return (new Date()).toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        hour12: true, // Use 24-hour time format
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}