import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        let joke: string = "";

        try {
            const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            const jokeText = await jokeResponse.json();
            joke = jokeText.joke;
            console.log(joke);
        } catch (error) {
            console.log(error);
        }

        const headers = {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
            "Content-type": "application/json;charset=utf-8",
        };

        const request_body = req.body || {
            channel_name: "general"
        };

        const { channel_name } = request_body;

        const raw = `{"channel": "${channel_name}","blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "${joke}"
                }
            }
        ], "text": "${joke}"}`;

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
