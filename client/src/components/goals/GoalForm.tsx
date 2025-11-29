import { useState } from "react";
import { Goal } from "../../api/goals";

interface GoalFormProps {
  addGoal: (goal: Goal) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ addGoal }) => {
  const [title, setTitle] = useState("");
  const [target_amount, setTargetAmount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || target_amount <= 0) return;

    const newGoal = {
      id: "", // backend сам сгенерирует id
      title,
      target_amount,
      current_amount: 0,
      created_at: new Date().toISOString(),
    };

    console.log("Отправляем на контекст/бэк:", newGoal); // <-- Логируем

    addGoal(newGoal);

    setTitle("");
    setTargetAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto flex flex-col gap-4">
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
        value={target_amount || ""}
        onChange={(e) => setTargetAmount(Number(e.target.value))}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors">
        Добавить цель
      </button>
    </form>
  );
};

export default GoalForm;
