import type { NextApiRequest, NextApiResponse } from "next";
import getajoke from "../../lib/getajoke";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        let joke: string = await getajoke();

        const headers = {
            Authorization: `Bearer ${process.env.BOT_USER_TOKEN}`,
            "Content-type": "application/json;charset=utf-8",
        };

        const request_body = req.body || {
            channel_id: "U03JZSV8JHW",
            user_name: "Dude",
        };

        const { channel_id, channel_name, user_id, user_name } = request_body;
        let raw = `{"channel": "${
            channel_name === "directmessage" ? user_id : channel_id
        }","blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Hi, ${user_name}! Here 👉 ${joke}"
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
            console.log(response);
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
