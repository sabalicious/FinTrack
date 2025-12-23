import { createContext, useState, useEffect, ReactNode } from "react";
import { Goal, getGoals, addGoal as apiAddGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from "../api/goals";
import { useAuth } from "./AuthContext";

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "date_created" | "current_amount">) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
}

export const GoalsContext = createContext<GoalsContextType | null>(null);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const data = await getGoals(token);
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  };

  const addGoal = async (goal: Omit<Goal, "id" | "current_amount" | "date_created">) => {
    if (!token) return;
    try {
      const payload = { ...goal, current_amount: 0, date_created: new Date().toISOString() };
      console.log("Отправляем на API:", payload); // <-- Логируем перед fetch

      const newGoal = await apiAddGoal(payload, token);
      console.log("Ответ от backend:", newGoal); // <-- Логируем ответ

      setGoals([newGoal, ...goals]);
    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  };

  const updateGoal = async (goal: Goal) => {
    if (!token) return;
    try {
      const updatedGoal = await apiUpdateGoal(goal, token); // передаём весь объект
      setGoals(goals.map(g => g.id === goal.id ? updatedGoal : g));
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!token) return;
    try {
      await apiDeleteGoal(id, token);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};
