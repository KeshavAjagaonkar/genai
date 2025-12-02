import express from "express";
import Thread from "../models/Thread.js"
import { generateGeminiResponse } from "../utils/geminiUtils.js";

const router = express.Router();

router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "ijk",
            title: "Testing new thread 3"
        });
        const response = await thread.save();
        res.send(response);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in database" });
    }
});

// Get all the thread

router.get("/thread", async (req, res) => {
    try {

        const thread = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(thread);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetched threads" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.message);
    }
    catch (err){
        console.log(err);
        res.status(500).json({ error: "Failed to fetch the chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if (!deletedThread) {
            res.status(404).json({ error: "thread is not found" });
        }
        res.status(200).json({ success: "thread deleted successfully" });

    } catch (err) {
        console.log(err);
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            //create a new thread
            thread = new Thread({
                threadId,
                title:message,
                message: [{ role: "user", content: message }]
            })
        }
        else {
            thread.message.push({ role: "user", content: message });
        }
        const geminiReply = await generateGeminiResponse(message);
        thread.message.push({ role: "assistant", content: geminiReply });
        thread.updatedAt = new Date();
        
        await thread.save();
        res.json({ success: geminiReply });
    }
    catch(err) {
        console.log(err);
    }
})

export default router;