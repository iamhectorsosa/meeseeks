import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { challenge } = req.body;

        try {
            res.status(200).json({
                challenge: `${challenge}`,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
