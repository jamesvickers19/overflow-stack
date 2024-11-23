// Handlers for API endpoints.

import {
  findAnswersByQuestionId,
  findQuestionById,
  saveAnswerForQuestionId,
} from "./repo";
import { z } from "zod";
import { Request, Response } from "express";

const addAnswerRequestSchema = z.object({
  questionId: z.number(),
  answerBody: z.string(),
});
type AddAnswerRequest = z.infer<typeof addAnswerRequestSchema>;

export async function addAnswerToQuestion(req: Request, res: Response) {
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
}

export async function getAnswersForQuestion(req: Request, res: Response) {
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
