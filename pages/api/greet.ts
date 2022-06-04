import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const reqHeaders = {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
            "Content-type": "application/json;charset=utf-8",
        };

        const commandBody = req.body || {
            channel_name: "general",
            user_name: "anonymous",
        };

        const { channel_name, user_name } = commandBody;

        const raw = `{"channel": "${channel_name}","text": "Hello, ${user_name}!"}`;

        const requestOptions = {
            method: "POST",
            headers: reqHeaders,
            body: raw,
        };

        try {
            const data = await fetch(
                "https://slack.com/api/chat.postMessage",
                requestOptions
            );
            res.status(200).end();
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(200).json({ response: "Hello! I'm The Garage" });
    }
}
