import AICoach from "@/components/ai/AICoach";

export default function AICoachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Financial Coach</h1>
        <p className="text-gray-500 mt-1">
          Ask anything about halal finance. Answers are personalized to your actual portfolio
          and goals, grounded in scholarly consensus.
        </p>
      </div>
      <AICoach />
    </div>
  );
}
