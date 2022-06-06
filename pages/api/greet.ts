import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../lib/database";

import { doc, getDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        console.log(req.body);
        const { team_id, response_url, user_name } = req.body;

        const db = await database();

        let botUserToken;

        try {
            const docRef = doc(db, "teams", `${team_id}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                botUserToken = docSnap.data().access_token;
            } else {
                console.log("This team isn't authorized!");
                res.status(404).end();
            }
        } catch (error) {
            console.error(error);
        }

        const headers = {
            Authorization: `Bearer ${botUserToken}`,
            "Content-type": "application/json",
        };

        let raw = `{
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "I'm Mr. Meeseeks! Look at me! Hello, ${user_name}",
                    },
                },
            ],
            text: "Hello, ${user_name}",
        }`;

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        try {
            const response = await fetch(`${response_url}`, requestOptions);
            console.log(response);
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
