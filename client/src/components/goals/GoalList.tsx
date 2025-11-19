import { useContext } from "react";
import { GoalsContext } from "../../context/GoalsContext";
import GoalItem from "./GoalItem";

const GoalList = () => {
  const goalsContext = useContext(GoalsContext);

  if (!goalsContext) {
    return <div>Ошибка: GoalsContext не найден</div>;
  }

  const { goals } = goalsContext;

  if (goals.length === 0) {
    return <p className="text-gray-500 text-center mt-6">Целей пока нет</p>;
  }

  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {goals.map((goal) => (
        <GoalItem key={goal.id} goal={goal}/>
      ))}
    </ul>
  );
};

export default GoalList;
