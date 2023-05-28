import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { decode } from "html-entities";

export default function Quizz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  let BtnName = "Check Answers";

  showResults ? (BtnName = "Play Again") : (BtnName = "Check Answers");

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
      const mixedQuestions = mixAnswersRandomly(decodedQuestions);
      setQuestions(mixedQuestions);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  function mixAnswersRandomly(questions) {
    const mixedQuestions = questions.map((question) => {
      const { correct_answer, incorrect_answers } = question;

      const combinedAnswers = [...incorrect_answers, correct_answer];
      const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5);
      const correctAnswerIndex = shuffledAnswers.findIndex(
        (answer) => answer === correct_answer
      );
      // update the question object with the new answers array and the correct answer position
      return {
        ...question,
        answers: shuffledAnswers,
        correctAnswerPosition: correctAnswerIndex,
        userAnswer: null, // track the user answer
      };
    });

    return mixedQuestions;
  }

  function handleAnswerClick(questionIndex, answerIndex) {
    if (!showResults) {
      setQuestions((prevQuestions) => {
        return prevQuestions.map((question, index) => {
          if (index === questionIndex) {
            return {
              ...question,
              userAnswer: answerIndex,
            };
          }
          return question;
        });
      });
    }
  }

  function checkAnswers() {
    setShowResults(true);
    questions.forEach((question) => {
      if (question.userAnswer === question.correctAnswerPosition) {
        setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
      }
    });
  }

  // reset the quiz
  function playAgain() {
    console.log("play again");
    setShowResults(false);
    setCorrectAnswers(0);
    const mixedQuestions = mixAnswersRandomly(questions);
    setQuestions(mixedQuestions);
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
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="text-center mt-8 items-start">
            <div>
              <h1 className="text-textColor text-xl font-semibold text-start">
                {question.question}
              </h1>
            </div>
            <div className="flex gap-4 mt-4 space-x-4">
              {question.answers.map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  onClick={() => {
                    handleAnswerClick(questionIndex, answerIndex);
                  }}
                  className={`border-solid border-textColor border-2 text-textColor text-center rounded-lg p-1 hover:shadow-lg ${
                    question.userAnswer !== null &&
                    !showResults &&
                    question.userAnswer === answerIndex
                      ? "bg-slate-500"
                      : "bg-mainBg"
                  } ${
                    showResults &&
                    question.userAnswer !== null &&
                    question.userAnswer === answerIndex
                      ? question.userAnswer === question.correctAnswerPosition
                        ? "bg-green-500"
                        : "bg-rose-300"
                      : ""
                  }`}
                  disabled={question.userAnswer !== null}
                >
                  {decode(answer)}
                </button>
              ))}
            </div>
            <hr className="mt-4  border-1 border-textColor" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {showResults && (
          <h3 className="text-textColor text-lg font-bold">{`Your Scored ${correctAnswers}/${questions.length} correct answers`}</h3>
        )}
        <button
          onClick={showResults ? playAgain : checkAnswers}
          className="bg-btnColor text-white rounded-full pl-5 pr-5 pt-2 pb-2 hover:shadow-lg"
        >
          {BtnName}
        </button>
      </div>
    </main>
  );
}
