import React, { useState, useEffect } from "react";
import GoalList from "../components/goals/GoalList";
import GoalForm from "../components/goals/GoalForm";
import { GoalsContext } from "../context/GoalsContext";
import { GoalsType } from "../types/goals";

const Goals: React.FC = () => {
  const stored = localStorage.getItem("goals");
  let initialGoals: GoalsType[] = [];

  if (stored) {
    try {
      initialGoals = JSON.parse(stored).map((g: GoalsType) => ({
        ...g,
        dateCreated: new Date(g.dateCreated),
      }));
    } catch {
      initialGoals = [];
    }
  }
  
  const [goals, setGoals] = useState<GoalsType[]>(initialGoals);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: GoalsType) => {
    setGoals((prev) => [...prev, goal]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const updateGoal = (updatedGoal: GoalsType) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, deleteGoal, updateGoal }}>
      <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Мои цели</h1>

        <GoalForm />

        <GoalList />
      </div>
    </GoalsContext.Provider>
  );
};

export default Goals;
