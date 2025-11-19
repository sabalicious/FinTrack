import { GoalsType } from "../../types/goals";
import { useContext, useState } from "react";
import { GoalsContext } from "../../context/GoalsContext";

interface GoalItemProps {
  goal: GoalsType;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editTargetAmount, setEditTargetAmount] = useState(goal.targetAmount);

  const goalsContext = useContext(GoalsContext);

  if (!goalsContext) return <div>Ошибка: GoalsContext не найден</div>;

  const { deleteGoal, updateGoal } = goalsContext;
  const percent = (goal.currentAmount / goal.targetAmount) * 100;

  const handleAddAmount = (amount: number) => {
    updateGoal({ ...goal, currentAmount: goal.currentAmount + amount });
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
  };

  const handleSave = () => {
    updateGoal({ ...goal, title: editTitle, targetAmount: editTargetAmount });
    setIsEditing(false);
  };

  return (
    <li
      className="bg-white p-4 rounded-xl shadow-md transform transition-all duration-300 
                  hover:scale-105 
                  hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4),0_4px_6px_-2px_rgba(99,102,241,0.3)]"
    >
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border p-1 rounded w-full"
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
        )}

        <span className="text-sm text-gray-500">
          {goal.dateCreated.toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm mt-2 text-gray-700">
        {isEditing ? (
          <input
            type="number"
            value={editTargetAmount}
            onChange={(e) => setEditTargetAmount(Number(e.target.value))}
            className="border p-1 rounded w-full"
          />
        ) : (
          `${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()} ₽`
        )}
      </p>

      <div className="w-full bg-gray-200 h-3 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-xs text-gray-600 mt-1">
        {percent.toFixed(1)}% completed
      </p>

      <div className="flex gap-2 mt-4">
        {!isEditing && (
          <>
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
          </>
        )}

        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Сохранить
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Отмена
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition"
          >
            Редактировать
          </button>
        )}
      </div>
    </li>
  );
};

export default GoalItem;
