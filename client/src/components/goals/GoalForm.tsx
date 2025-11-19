import React, { useContext, useState } from "react";
import { GoalsType } from "../../types/goals";
import { nanoid } from "nanoid";
import { GoalsContext } from "../../context/GoalsContext";

const GoalForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<number>(0);

  const goalsContext = useContext(GoalsContext);
  if (!goalsContext) {
    return <div>Ошибка: GoalsContext не найден</div>;
  }

  const { addGoal } = goalsContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || targetAmount <= 0) return;

    const newGoal: GoalsType = {
      id: nanoid(),
      title,
      targetAmount,
      currentAmount: 0,
      dateCreated: new Date(),
    };

    addGoal(newGoal);

    setTitle("");
    setTargetAmount(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto flex flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Название цели"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="number"
        placeholder="Сумма"
        value={targetAmount || ""}
        onChange={(e) =>
          setTargetAmount(e.target.value ? Number(e.target.value) : 0)
        }
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Добавить цель
      </button>
    </form>
  );
};

export default GoalForm;
