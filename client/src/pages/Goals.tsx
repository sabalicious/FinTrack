import { useContext } from "react";
import { GoalsContext } from "../context/GoalsContext";
import GoalForm from "../components/goals/GoalForm";
import GoalList from "../components/goals/GoalList";

export default function Goals() {
  const goalsContext = useContext(GoalsContext);
  if (!goalsContext) return <div>Ошибка: GoalsContext не найден</div>;

  const { addGoal } = goalsContext;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Цели</h2>
      <GoalForm addGoal={addGoal} />
      <GoalList />
    </div>
  );
}
