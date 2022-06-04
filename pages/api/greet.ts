import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        console.log(req.body);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.BOT_TOKEN}`);
        myHeaders.append("Content-type", "application/json;charset=utf-8");

        const raw = `{"channel":"#software-development","text": "Hello!"}`;

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        try {
            const data = await fetch(
                "https://slack.com/api/chat.postMessage",
                requestOptions
            );
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(200).json({ response: "Hello! I'm The Garage" });
    }
}
