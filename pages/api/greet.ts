import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    response: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        console.log(req.body);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.BOT_TOKEN}`);
        myHeaders.append("Content-type", "application/json;charset=utf-8");

        var raw = `{"channel":"#software-development","text": "Hello!"}`;

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        try {
            await fetch(
                "https://slack.com/api/chat.postMessage",
                requestOptions
            );
        } catch (error) {
            console.log(error);
        }
        res.status(200);
    } else {
        res.status(200).json({ response: "Hello! I'm The Garage" });
    }
}
