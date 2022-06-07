export default function botSignOff(type: string) {
    const botSignOffMessages = [
        `approves this message`,
        `wanted you to read this ${type}`,
        `and I care about you`,
        `wants your attention`,
        `and I, with love`,
        `thinks you care about this ${type}`,
        `and I apologize in advance for this ${type}`,
        `and I are having an existential crisis, hopefully that explains this ${type}`,
        `and I, may or may not, have been trying to fix a bug for hours`,
        `and I think this ${type} should've been an unhandled error`,
        `and I are asking ourselves a simple question: why`,
    ];
    const botSignOff =
        botSignOffMessages[
            Math.floor(Math.random() * botSignOffMessages.length)
        ];

    return botSignOff;
}
