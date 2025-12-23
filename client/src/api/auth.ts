import { API_URL } from './config';

export interface User {
  id: string;
  username?: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileResponse {
  user: User;
}

// Регистрация
export const register = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    // Пытаемся прочитать JSON-ошибку, но если сервер вернул HTML (<!DOCTYPE ...>),
    // не падаем с Unexpected token '<', а показываем понятное сообщение.
    if (contentType.includes('application/json')) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    } else {
      const text = await res.text();
      console.error('Non-JSON error response for register:', text);
      throw new Error('Registration failed. Server returned unexpected response.');
    }
  }

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON success response for register:', text);
    throw new Error('Registration succeeded, but server returned unexpected format.');
  }

  return res.json();
};

// Вход
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    } else {
      const text = await res.text();
      console.error('Non-JSON error response for login:', text);
      throw new Error('Login failed. Server returned unexpected response.');
    }
  }

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON success response for login:', text);
    throw new Error('Login succeeded, but server returned unexpected format.');
  }

  return res.json();
};

// Выход (просто очищает localStorage)
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Обновление профиля (username/email)
export const updateProfile = async (data: { username?: string; email?: string }, token: string): Promise<ProfileResponse> => {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update profile');
  }

  return res.json();
};

