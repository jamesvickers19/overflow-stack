import { useEffect, useState } from "react";
import { serverBaseUrl } from "../constants";
import { Answer, Question } from "../types";

async function fetchAnswersForQuestion(questionId: number) {
  const response = await fetch(
    `${serverBaseUrl}/question/${questionId}/answers`
  );
  if (!response.ok) {
    console.error(
      `Error status ${response.status}, body: ${await response.text()}`
    );
    return [];
  }

  const json = await response.json();
  return json.answers as Answer[];
}

async function createNewAnswer(questionId: number, answerBody: string) {
  const requestBody = { questionId, answerBody };
  const response = await fetch(`${serverBaseUrl}/add-answer-to-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    console.error(
      `Error status ${response.status}, body: ${await response.text()}`
    );
    return false;
  }
  return true;
}

interface QuestionDetailsProps {
  question: Question;
  onClose: () => void;
}

function QuestionDetails({ question, onClose }: QuestionDetailsProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswerText, setNewAnswerText] = useState<string>("");
  const loadQuestions = async () => {
    setAnswers((await fetchAnswersForQuestion(question.id)) ?? []);
  };
  const saveAnswer = async () => {
    const success = await createNewAnswer(question.id, newAnswerText);
    if (success) {
      setNewAnswerText("");
      loadQuestions();
    } else {
      alert("Could not save answer, try again");
    }
  };
  useEffect(() => {
    loadQuestions();
  }, []);
  return (
    <div>
      <button onClick={onClose}>Close</button>
      <h1>{question.title}</h1>
      <p>{question.body}</p>
      {!answers.length ? (
        <h3>No answers yet</h3>
      ) : (
        <div>
          <h3>Answers:</h3>
          <ul>
            {answers.map((a) => {
              return (
                <li key={a.id}>
                  <div>
                    <p>{a.body}</p>
                    <p>(Created At {a.created_at})</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div>
        <h3>Add your own answer:</h3>
        <input
          type="text"
          onChange={(e: any) => setNewAnswerText(e.target.value)}
        ></input>
        <button
          disabled={newAnswerText.trim().length === 0}
          onClick={() => saveAnswer()}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default QuestionDetails;
