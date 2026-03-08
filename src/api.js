const apiUrl = import.meta.env.VITE_API_URL;

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    // try refresh
    const refreshRes = await fetch(`${apiUrl}/api/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // retry original request
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      throw new Error("Session expired");
    }
  }

  return res;
};