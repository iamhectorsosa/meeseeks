import type { NextApiRequest, NextApiResponse } from "next";
import getajoke from "../../lib/getajoke";
import database from "../../lib/database";

import { doc, getDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const request_body = req.body || {
            team_id: "T03J77FN62Z",
            channel_id: "U03JZSV8JHW",
            user_name: "Dude",
        };

        const { team_id, channel_id, channel_name, user_id } = request_body;

        const db = await database();

        let botUserToken;

        try {
            const docRef = doc(db, "teams", `${team_id}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                botUserToken = docSnap.data().access_token;
            } else {
                console.log("This team isn't authorized!");
                res.status(404).end();
            }
        } catch (error) {
            console.error(error);
        }

        let joke: string = await getajoke();

        const headers = {
            Authorization: `Bearer ${botUserToken}`,
            "Content-type": "application/json;charset=utf-8",
        };

        let raw = `{"channel": "${
            channel_name === "directmessage" ? user_id : channel_id
        }","blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "I'm Mr. Meeseeks! Look at me! ${joke}"
                }
            }
        ], "text": "${joke}"}`;

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        try {
            const response = await fetch(
                "https://slack.com/api/chat.postMessage",
                requestOptions
            );
            // console.log(response);
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
