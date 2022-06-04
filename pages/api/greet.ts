import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const headers = {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
            "Content-type": "application/json;charset=utf-8",
        };

        const request_body = req.body || {
            channel_name: "general",
            user_name: "anonymous",
        };

        const { channel_name, user_name } = request_body;

        const raw = `{"channel": "${channel_name}","blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Hello, ${user_name}! This is *The Garage* speaking! For more information please visit this <https://github.com/ekqt/slack-bot|repo>!"
                }
            }
        ], "text": "Hello, ${user_name}!"}`;

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        try {
            await fetch(
                "https://slack.com/api/chat.postMessage",
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
