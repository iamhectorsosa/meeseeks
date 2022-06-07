export default function botSignOff() {
    const botSignOffMessages = [
        "approves this message",
        "wanted you to read this",
        "cares about you",
        "wants your attention",
        "and I, with love",
        "thinks you want to read this",
        "and I apologize in advance for this message"
    ];
    const botSignOff =
        botSignOffMessages[
            Math.floor(Math.random() * botSignOffMessages.length)
        ];

    return botSignOff;
}
