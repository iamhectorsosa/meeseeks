import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    response: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${process.env.BOT_TOKEN}`
        );
        myHeaders.append("Content-type", "application/json;charset=utf-8");

        var raw = `{"channel":"#software-development","text": "Hello, there!"}`;

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch("https://slack.com/api/chat.postMessage", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
        res.status(200).json({ response: "Message successfully sent!" });
    } else {
        res.status(200).json({ response: "Hello! I'm The Garage" });
    }
}
