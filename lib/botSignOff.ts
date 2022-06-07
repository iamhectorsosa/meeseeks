export default function botSignOff(type: string) {
    const botSignOffMessages = [
        `approves this ${type} message`,
        `wanted you to read this ${type}`,
        `and I care about you and wanted you to have this ${type}`,
        `wants your attention`,
        `and I, with love`,
        `thinks you want to read this ${type}`,
        `and I apologize in advance for this ${type} message`,
        `and I are having an existential crisis, hope that explains this ${type}`,
        `and I, may or may not, have been trying to fix a bug for hours.`,
    ];
    const botSignOff =
        botSignOffMessages[
            Math.floor(Math.random() * botSignOffMessages.length)
        ];

    return botSignOff;
}
