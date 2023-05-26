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
      const mixedQuestions = mixAnswersRandomly(decodedQuestions);
      setQuestions(mixedQuestions);
      setLoading(false);
      console.log(questions);
    }
    fetchQuestions();
  }, []);

  function mixAnswersRandomly(questions) {
    console.log(`Questions Before:`, questions);

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
        userAnswer: null, // Added userAnswer property to track the user's selection
      };
    });

    console.log(`Questions After:`, mixedQuestions);

    // Return the mixed questions
    return mixedQuestions;
  }

  // Handle the click on an answer
  function handleAnswerClick(
    questionIndex,
    answerIndex,
    correctAnswerPosition
  ) {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question, index) => {
        if (index === questionIndex && question.userAnswer === null) {
          if (answerIndex === correctAnswerPosition) {
            return {
              ...question,
              userAnswer: answerIndex,
            };
          } else {
            return {
              ...question,
              userAnswer: answerIndex,
              wrongAnswerClicked: true,
            };
          }
        }
        return question;
      });
    });
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
            <div className="">
              <h1 className="text-textColor text-xl font-semibold text-start">
                {question.question}
              </h1>
            </div>
            <div className="flex gap-4 mt-4 space-x-4">
              {question.answers.map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  onClick={() => {
                    handleAnswerClick(
                      questionIndex,
                      answerIndex,
                      question.correctAnswerPosition
                    );
                  }}
                  className={`border-solid border-textColor border-2 text-textColor text-center rounded-lg p-1 hover:shadow-lg ${
                    question.userAnswer !== null
                      ? answerIndex === question.correctAnswerPosition
                        ? "bg-green-400"
                        : "bg-mainBg"
                      : ""
                  }`}
                  disabled={question.userAnswer !== null} // Disable button if user has already answered
                >
                  {decode(answer)}
                </button>
              ))}
            </div>
            <hr className="mt-4  border-1 border-textColor" />
          </div>
        ))}
      </div>

      <button className="bg-btnColor text-white rounded-md p-3 mb-8">
        Check Answers
      </button>
    </main>
  );
}
