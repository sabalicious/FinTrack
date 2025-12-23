import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes, createNote, updateNote, deleteNote, Note } from '../api/notes';
import { useContext } from 'react';
import { GoalsContext } from '../context/GoalsContext';

export default function Notes() {
  const { token } = useAuth();
  const goalsContext = useContext(GoalsContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note' as 'note' | 'reminder' | 'plan',
    priority: 'medium' as 'low' | 'medium' | 'high',
    related_goal_id: '',
    due_date: ''
  });

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getNotes(token);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.title) return;

    try {
      const newNote = await createNote({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        related_goal_id: formData.related_goal_id || undefined,
        due_date: formData.due_date || undefined
      }, token);
      setNotes([newNote, ...notes]);
      setFormData({ title: '', content: '', type: 'note', priority: 'medium', related_goal_id: '', due_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (note: Note) => {
    if (!token) return;
    try {
      const updated = await updateNote({ ...note, is_completed: !note.is_completed }, token);
      setNotes(notes.map(n => n.id === note.id ? updated : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Удалить эту заметку?')) return;
    try {
      await deleteNote(id, token);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  const typeIcons = {
    note: '📝',
    reminder: '⏰',
    plan: '🎯'
  };

  const priorityLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий'
  };

  const typeLabels = {
    note: 'Заметка',
    reminder: 'Напоминание',
    plan: 'План'
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Заметки и планы</h2>

      {/* Форма создания */}
      <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Создать заметку</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Заголовок"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Подробное описание (опционально)"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 h-24"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="note">Заметка</option>
              <option value="reminder">Напоминание</option>
              <option value="plan">План</option>
            </select>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Низкий приоритет</option>
              <option value="medium">Средний приоритет</option>
              <option value="high">Высокий приоритет</option>
            </select>
            <select
              value={formData.related_goal_id}
              onChange={e => setFormData({ ...formData, related_goal_id: e.target.value })}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Без цели</option>
              {goalsContext?.goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold">
          Создать
        </button>
      </form>

      {/* Список заметок */}
      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className={`p-4 rounded-xl border-2 ${note.is_completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={note.is_completed}
                onChange={() => handleToggleComplete(note)}
                className="w-5 h-5 mt-1 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{typeIcons[note.type]}</span>
                  <h3 className={`text-lg font-semibold ${note.is_completed ? 'line-through text-gray-500' : ''}`}>
                    {note.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded ${priorityColors[note.priority]}`}>
                    {priorityLabels[note.priority]}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    {typeLabels[note.type]}
                  </span>
                </div>
                {note.content && (
                  <p className="text-sm text-gray-600 mb-2">{note.content}</p>
                )}
                <div className="flex gap-3 text-xs text-gray-500">
                  {note.due_date && (
                    <div>📅 {new Date(note.due_date).toLocaleDateString('ru-RU')}</div>
                  )}
                  {note.goal_title && (
                    <div>🎯 Цель: {note.goal_title}</div>
                  )}
                  <div>📆 Создано: {new Date(note.created_at).toLocaleDateString('ru-RU')}</div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📋</div>
          Нет заметок
        </div>
      )}
    </div>
  );
}
