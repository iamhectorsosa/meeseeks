export default function botSignOff(type: string) {
    const botSignOffMessages = [
        `and I approve of this message`,
        `wanted me to tell you this ${type}`,
        `and I care about you`,
        `wants your attention`,
        `and I, with love`,
        `thinks you care about this ${type}. I don't`,
        `and I apologize in advance for this ${type}`,
        `and I are having an existential crisis, hopefully that explains this ${type}`,
        `and I, may or may not, have been trying to fix a bug for hours`,
        `and I think this ${type} should've been an unhandled server error`,
        `and I are asking ourselves a simple question: why`,
        `and I question if I could've been a useful bot`,
    ];
    const botSignOff =
        botSignOffMessages[
            Math.floor(Math.random() * botSignOffMessages.length)
        ];

    return botSignOff;
}
