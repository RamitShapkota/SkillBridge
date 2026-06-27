const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/users";

export const refreshToken = async () => {
  const response = await fetch(`${API_URL}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
};
