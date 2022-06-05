import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../lib/database";

import { collection, doc, setDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append(
            "code",
            `${req.query.code}`
        );
        urlencoded.append("client_id", `${process.env.CLIENT_ID}`);
        urlencoded.append("client_secret", `${process.env.CLIENT_SECRET}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };

        try {
            const response = await fetch(
                "https://slack.com/api/oauth.v2.access",
                requestOptions
            );
            const responseJson = await response.json();

            console.log(responseJson);

            const { team, access_token, incoming_webhook } = responseJson;

            const db = await database();

            const docRef = collection(db, "teams");

            await setDoc(doc(docRef, `${team.id}`), {
                access_token: `${access_token}`,
                incoming_wekhook_url: `${incoming_webhook.url}`,
                team_name: `${team.name}`,
            });
        } catch (error) {
            console.error(error);
        }

        res.redirect("slack://");
    } else {
        res.status(404).end();
    }
}
