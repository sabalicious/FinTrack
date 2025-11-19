import { createContext } from "react";
import { GoalsType } from "../types/goals";

interface GoalsContextType {
  goals: GoalsType[];
  addGoal: (goal: GoalsType) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (goal: GoalsType) => void;
}

export const GoalsContext = createContext<GoalsContextType | null>(null); 