const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/users";

type Role = "student" | "client" | "admin";

export type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
};

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}): Promise<ApiResponse<AuthUser>> => {
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




export const loginUser = async (userData: {
  email: string;
  password: string;
  loginType?: "common" | "admin";
}): Promise<
  ApiResponse<{
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }>
> => {
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


export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};



export const getCurrentUser = async (): Promise<ApiResponse<AuthUser>> => {
  const response = await fetch(`${API_URL}/current-user`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};