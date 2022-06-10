import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../lib/database";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req.body);
    const { challenge } = req.body;

    if (req.method === "POST" && challenge) {
        try {
            res.status(200).json({
                challenge: `${challenge}`,
            });
        } catch (error) {
            console.log(error);
        }
    } else if (req.method === "POST") {
        const { team_id, event } = req.body;

        try {
            const db = await database();
            const docRef = doc(db, "teams", `${team_id}`);
            const docSnap = await getDoc(docRef);

            let botUserToken;

            if (docSnap.exists()) {
                botUserToken = docSnap.data().access_token;
            } else {
                res.status(404).end();
            }

            const headers = {
                Authorization: `Bearer ${botUserToken}`,
                "Content-type": "application/json",
            };

            let raw = {
                channel: `${event.item.channel}`,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "I'm Mr. Meeseeks! Look at me! If you want me to tell a joke, advice, useless facts or to even make excuses for you! I suuuure can dooo! Use _slash commands_ to summon me such as: `/tellmeajoke`, `/givemeadvice`, `/tellmeafact`, or `/excuseme`. If I am busy talking with someone else and don't reply, just ask again.",
                        },
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: `*<@${event.user}>* wanted me to introduce myself.`,
                            },
                        ],
                    },
                ],
                text: "Hello, I'm Mr. Meeseeks! Look at me!",
            };

            const requestOptions = {
                method: "POST",
                headers,
                body: JSON.stringify(raw),
            };

            await fetch(
                `https://slack.com/api/chat.postMessage`,
                requestOptions
            );
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
