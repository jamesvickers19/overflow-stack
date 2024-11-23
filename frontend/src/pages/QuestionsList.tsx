import { useEffect, useState } from "react";
import { serverBaseUrl } from "../constants";
import QuestionDetails from "./QuestionDetails";

async function fetchQuestions() {
  const response = await fetch(`${serverBaseUrl}/questions`);
  if (!response.ok) {
    console.error(`Error status ${response.status}, body: ${response.body}`);
    return [];
  }

  return await response.json();
}

function QuestionsList() {
  const [questions, setQuestions] = useState<any[]>([]);
  useEffect(() => {
    const loadQuestions = async () => {
      const retrievedQuestions = await fetchQuestions();
      setQuestions(retrievedQuestions.questions ?? []);
    };
    loadQuestions();
  }, []);
  const [openedQuestion, setOpenedQuestion] = useState<any | undefined | null>(
    null
  );

  return (
    <div>
      {openedQuestion ? (
        <QuestionDetails
          question={openedQuestion}
          onClose={() => setOpenedQuestion(null)}
        />
      ) : (
        <ul>
          {questions.map((q) => {
            return (
              <li
                key={q.id}
                style={{
                  listStyleType: "none",
                  padding: 0,
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenedQuestion(q)}
                >
                  {`${q.title} (created ${q.created_at})`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default QuestionsList;
