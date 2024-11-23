import { useEffect, useState } from "react";
import { serverBaseUrl } from "../constants";
import QuestionDetails from "./QuestionDetails";
import { Question } from "../types";

async function fetchQuestions() {
  const response = await fetch(`${serverBaseUrl}/questions`);
  if (!response.ok) {
    console.error(`Error status ${response.status}, body: ${response.body}`);
    return [];
  }

  const json = await response.json();
  return json.questions as Question[];
}

async function searchQuestions(query: string) {
  const response = await fetch(`${serverBaseUrl}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    console.error(`Error status ${response.status}, body: ${response.body}`);
    return [];
  }

  const json = await response.json();
  return json.results as Question[];
}

function QuestionsList() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = searchQuery?.trim()?.length
        ? await searchQuestions(searchQuery)
        : await fetchQuestions();
      setQuestions(questions ?? []);
    };
    loadQuestions();
  }, [searchQuery]);
  const [openedQuestion, setOpenedQuestion] = useState<Question | null>(null);

  return (
    <div>
      {openedQuestion ? (
        <QuestionDetails
          question={openedQuestion}
          onClose={() => setOpenedQuestion(null)}
        />
      ) : (
        <div>
          <label htmlFor="searchInput">Search:</label>
          <input
            id="searchInput"
            type="text"
            onChange={(e: any) => setSearchQuery(e.target.value)}
          ></input>
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
        </div>
      )}
    </div>
  );
}

export default QuestionsList;
