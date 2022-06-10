import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../lib/database";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { challenge } = req.body;

        try {
            let raw = {
                challenge: `${challenge}`,
            };

            res.status(200).json({ raw });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).end();
    }
}
