import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col bg-mainBg h-screen items-center justify-center space-y-14">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-textColor text-2xl font-semibold">Trivia Quizz</h1>
        <p className="text-textColor text-lg">
          Test your knowledge with this trivia quizz!
        </p>
      </div>
      <button className="bg-btnColor text-btnText rounded-md p-2 focus:ring-2 shadow-lg transform active:scale-75 transition-transform">
        <Link to="/quizz">Start Quiz</Link>
      </button>
    </div>
  );
}
