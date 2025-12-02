import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { generateGeminiResponse } from "./utils/geminiUtils.js";
import mongoose from "mongoose";


import chatRoutes from "./routes/Chat.js"
import authRouter from "./routes/auth.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api', chatRoutes);//express routing 

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database");
  } catch (err) {
    console.log(err);
  }
}

app.get('/', (req, res) => {
  res.send("hi keshav this is root path");
})
app.post("/chat", async (req, res) =>  {
  try {
    const userMessage = req.body.message;

    // ✅ Use our utility function here
    const aiResponse = await generateGeminiResponse(userMessage);

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDb();
});