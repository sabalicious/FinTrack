import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    setStatus("");
    setError("");
    if (!username || username.length < 3) {
      setError("Имя пользователя должно быть не короче 3 символов");
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ username });
      setStatus("Имя пользователя обновлено");
    } catch (err: any) {
      setError(err.message || "Не удалось сохранить настройки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Настройки профиля</h1>

      {status && <div className="p-3 rounded bg-green-50 text-green-700 border border-green-200 text-sm">{status}</div>}
      {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>}

      <label className="flex flex-col gap-1">
        Имя пользователя
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded-md"
          minLength={3}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        Email (только чтение)
        <input
          type="email"
          value={email}
          disabled
          className="border p-2 rounded-md bg-gray-100 text-gray-500"
        />
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Сохраняем..." : "Сохранить"}
      </button>
    </div>
  );
};

export default Settings;
