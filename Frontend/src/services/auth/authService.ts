const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/users";

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const loginUser = async (userData: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
