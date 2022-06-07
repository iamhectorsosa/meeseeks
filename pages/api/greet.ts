import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../lib/database";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { team_id, response_url, user_id } = req.body;

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
                response_type: "in_channel",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "I'm Mr. Meeseeks! Look at me! If you want a joke, advice or a useless fact! I suuuure can dooo! Use _slash commands_ to summon me: `/tellmeajoke`, `/givemeadvice`, or `/tellmeafact`.",
                        },
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: `*<@${user_id}>* wanted me to introduce myself.`,
                            },
                        ],
                    },
                ],
                text: "Hello, I'm Mr. Meeseeks! Look at me!",
            };

            const requestOptions = {
                method: "POST",
                headers,
                body: JSON.stringify(raw)
            };

            await fetch(`${response_url}`, requestOptions);
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
