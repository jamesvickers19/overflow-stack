import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  findAnswersByQuestionId,
  findQuestionById,
  saveAnswerForQuestionId,
} from "./repo";
import { z } from "zod";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server alive at " + new Date());
});

app.get(
  "/question/:questionId/answers",
  async (req: Request, res: Response) => {
    const questionIdParam = req.params.questionId;
    const questionId = Number(questionIdParam);
    if (isNaN(questionId)) {
      res.status(400).json({
        errors: [
          `questionId route parameter must be a number, but got: '${questionIdParam}'`,
        ],
      });
    }
    const existingQuestion = await findQuestionById(questionId);
    if (!existingQuestion) {
      res
        .status(404)
        .json({ errors: [`question with id ${questionId} does not exist`] });
      return;
    }

    const answers = await findAnswersByQuestionId(questionId);
    res.json({ answers });
  }
);

const addAnswerRequestSchema = z.object({
  questionId: z.number(),
  answerBody: z.string(),
});
type AddAnswerRequest = z.infer<typeof addAnswerRequestSchema>;

app.post("/add-answer-to-question", async (req: Request, res: Response) => {
  const parsedRequest = addAnswerRequestSchema.safeParse(req.body);

  if (!parsedRequest.success) {
    res.status(400).json({ errors: parsedRequest.error.errors });
    return;
  }

  const addAnswerRequest: AddAnswerRequest = parsedRequest.data;

  if (addAnswerRequest.answerBody.trim().length === 0) {
    res.status(400).json({ errors: ["Answer body cannot be empty or blank"] });
    return;
  }

  const questionId = addAnswerRequest.questionId;
  const existingQuestion = await findQuestionById(questionId);
  if (!existingQuestion) {
    res
      .status(404)
      .json({ errors: [`question with id ${questionId} does not exist`] });
    return;
  }

  const savedAnswer = await saveAnswerForQuestionId(
    {
      body: addAnswerRequest.answerBody,
    },
    questionId
  );
  res.status(201).json({ success: true, savedAnswer });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
