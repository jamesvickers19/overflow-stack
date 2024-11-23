import { db } from "./database";
import { AnswerTable, QuestionTable } from "./database-types";
import { Answer, Question } from "./types";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
const numberIdNamespace = "ae5c1833-e50d-4a11-befb-e2393d6bda46";

export const hashNumericalIdToUUID = (id: number) =>
  uuidv5(id.toString(), numberIdNamespace);

const getEntityUUID = (uuid?: string, id?: number) =>
  uuid ?? (id ? hashNumericalIdToUUID(id) : uuidv4());

export async function findQuestionById(id: number) {
  return await db
    .selectFrom("question")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findAnswersByQuestionId(questionId: number) {
  return await db
    .selectFrom("answer")
    .where("question_uuid", "=", hashNumericalIdToUUID(questionId))
    .orderBy("created_at")
    .selectAll()
    .execute();
}

export async function saveAnswerForQuestionId(
  answer: Answer,
  questionId: number
) {
  const savedAnswer = await db
    .insertInto("answer")
    .values(answerToTable(hashNumericalIdToUUID(questionId), answer))
    .returningAll()
    .executeTakeFirst();
  return savedAnswer;
}

function answerToTable(questionUUID: string, answer: Answer): AnswerTable {
  return {
    uuid: getEntityUUID(answer.uuid, answer.id),
    id: answer.id,
    body: answer.body,
    question_uuid: questionUUID,
    created_at: answer.createdAt,
  };
}

export async function saveQuestions(questions: Question[]) {
  let answersToWrite: AnswerTable[] = [];
  let questionsToWrite: QuestionTable[] = [];
  questions.forEach((q) => {
    const questionUUID = getEntityUUID(q.uuid, q.id);
    questionsToWrite.push({
      uuid: questionUUID,
      id: q.id,
      title: q.title,
      body: q.body,
      created_at: q.createdAt,
    });
    answersToWrite = answersToWrite.concat(
      q.answers.map((a) => answerToTable(questionUUID, a))
    );
  });

  await db.transaction().execute(async (trx) => {
    if (questionsToWrite.length) {
      await trx
        .insertInto("question")
        .values(questionsToWrite)
        .onConflict((oc) =>
          oc.column("uuid").doUpdateSet({
            id: (eb: { ref: (arg0: string) => any }) => eb.ref("excluded.id"),
            body: (eb: { ref: (arg0: string) => any }) =>
              eb.ref("excluded.body"),
            title: (eb: { ref: (arg0: string) => any }) =>
              eb.ref("excluded.title"),
          })
        )
        .execute();
    }
    if (answersToWrite.length) {
      await trx
        .insertInto("answer")
        .values(answersToWrite)
        .onConflict((oc) =>
          oc.column("uuid").doUpdateSet({
            body: (eb: { ref: (arg0: string) => any }) =>
              eb.ref("excluded.body"),
            id: (eb: { ref: (arg0: string) => any }) => eb.ref("excluded.id"),
          })
        )
        .execute();
    }
  });
}