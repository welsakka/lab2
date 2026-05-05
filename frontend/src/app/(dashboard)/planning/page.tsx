import RetirementPlanner from "@/components/planning/RetirementPlanner";

export default function PlanningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Planning</h1>
        <p className="text-gray-500 mt-1">
          AI-powered retirement roadmap with Zakat modeling, halal home purchase strategy,
          and Islamic estate planning.
        </p>
      </div>
      <RetirementPlanner />
    </div>
  );
}
