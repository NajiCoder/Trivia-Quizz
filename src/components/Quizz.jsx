import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { decode } from "html-entities";

export default function Quizz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
      );
      const data = await response.json();
      const decodedQuestions = data.results.map((question) => {
        return {
          ...question,
          question: decode(question.question),
        };
      });
      setQuestions(decodedQuestions);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const mixedQuestions = mixAnswersRandomly(questions);
      setQuestions(mixedQuestions);
    }
  }, [questions]);

  function mixAnswersRandomly(questions) {
    console.log(`Questions Beforre: ${questions}`);

    const mixedQuestions = questions.map((question) => {
      const { correct_answer, incorrect_answers } = question;

      const combinedAnswers = [...incorrect_answers, correct_answer];
      // Shuffle the array
      const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5);
      // Find the index of the correct answer in the shuffled array
      const correctAnswerIndex = shuffledAnswers.findIndex(
        (answer) => answer === correct_answer
      );

      // Update the question with the mixed answers and the index of the correct answer
      return {
        ...question,
        answers: shuffledAnswers,
        correctAnswerPosition: correctAnswerIndex,
      };
    });

    console.log(`Questions After: ${mixedQuestions}`);

    // Return the mixed questions
    return mixedQuestions;
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <AiOutlineLoading className="text-4xl animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-2 h-screen">
      <div className="flex flex-col h-full items-start mb-0">
        {questions.map((question, index) => (
          <div key={index} className="text-center mt-8 items-start">
            <div className="">
              <h1 className="text-textColor text-xl font-semibold text-start">
                {question.question}
              </h1>
            </div>
            <div className="flex gap-4 mt-4 space-x-4">
              {question.incorrect_answers.map((answer, index) => (
                <button
                  key={index}
                  className="bg-mainBg border-solid border-textColor border-2 text-textColor text-center rounded-lg p-1 hover:bg-gray-400"
                >
                  {decode(answer)}
                </button>
              ))}
              <button className="bg-rose-200 text-textColor text-center rounded-md p-2">
                {decode(question.correct_answer)}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-btnColor text-white rounded-md p-3 mb-8">
        Check Answers
      </button>
    </main>
  );
}
