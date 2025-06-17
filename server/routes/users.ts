import express, { Request, Response } from "express";
import { User } from "../models/User";


const router = express.Router();

router.post("/color", async (req: Request, res: Response) => { //used to update user's chat color
    const { username, color } = req.body;
    if (!username || !color) {
        res.status(400).json({ error: "Username and color are required." }); //cant return these for some reason
    }

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { color } },
            { new: true, upsert: true }
        );
        res.json(user);

    } catch (err) {
        res.status(500).json({ error: "Server error updating user's color." });
    }
});

export default router;