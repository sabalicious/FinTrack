import { Goal } from "../../api/goals";
import { useContext } from "react";
import { GoalsContext } from "../../context/GoalsContext";

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const goalsContext = useContext(GoalsContext);
  if (!goalsContext) return <div>Ошибка: GoalsContext не найден</div>;

  const { deleteGoal, updateGoal } = goalsContext;

  // Если поля не определены, используем 0
  const current = Math.round(goal.current_amount) ?? 0;
  const target = Math.round(goal.target_amount) ?? 0;
  const percent = target > 0 ? (current / target) * 100 : 0;

  const handleAddAmount = (amount: number) => {
    const updatedGoal = { ...goal, current_amount: current + amount };
    updateGoal(updatedGoal);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
  };

  return (
    <li className="bg-white p-4 rounded-xl shadow-md transform transition-all duration-300 
                hover:scale-105 
                hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4),0_4px_6px_-2px_rgba(99,102,241,0.3)]">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
        <span className="text-sm text-gray-500">
          {new Date(goal.created_at).toLocaleDateString("ru-RU")}
        </span>
      </div>

      <p className="text-sm mt-2 text-gray-700">
        {current} / {target} ₽
      </p>


      <div className="w-full bg-gray-200 h-3 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${percent}%`}}
        ></div>
      </div>

      <p className="text-xs text-gray-600 mt-1">{percent.toFixed(1)}% completed</p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleAddAmount(1000)}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          +1000 ₽
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Удалить
        </button>
      </div>
    </li>
  );
};

export default GoalItem;