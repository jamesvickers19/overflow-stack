import questions from "./stackoverfaux.json";
import { saveQuestions } from "../src/repo";

const epochSecondsToDate = (epochSeconds: number) =>
  new Date(epochSeconds * 1000);

const questionsToSave = questions.map((q) => {
  return {
    ...q,
    createdAt: epochSecondsToDate(q.creation),
    answers: q.answers.map((a) => {
      return {
        createdAt: epochSecondsToDate(a.creation),
        ...a,
      };
    }),
  };
});

saveQuestions(questionsToSave);
