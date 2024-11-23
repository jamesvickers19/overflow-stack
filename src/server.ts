// API server definition and instantiation.

import express, { Express, Request, Response } from "express";
import { addAnswerToQuestion, getAnswersForQuestion } from "./handlers";

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server alive at " + new Date());
});

app.get(
  "/question/:questionId/answers",
  async (req: Request, res: Response) => {
    await getAnswersForQuestion(req, res);
  }
);

app.post("/add-answer-to-question", async (req: Request, res: Response) => {
  await addAnswerToQuestion(req, res);
});

const port = 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
