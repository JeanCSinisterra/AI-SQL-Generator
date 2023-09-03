import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";
const PORT = process.env.PORT || 8000;
dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post("/completions", async (req: Request, res: Response) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
          role: "user" , 
          content: "Create a SQL request to " + req.body.message}],
          max_tokens: 15,
          temperature: 0
    });
    res.send(chatCompletion.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
