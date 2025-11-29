import React, { useState, useEffect } from "react";

const Settings: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // При монтировании можно загрузить значения из localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    alert("Settings saved!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <label className="flex flex-col gap-1">
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col gap-1">
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-md"
        />
      </label>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
