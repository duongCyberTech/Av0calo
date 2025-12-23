import { fetchJSON } from "../utils/api";

// ===== AUTH =====
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// ===== API =====
export const getSubscriptionCart = async () => {
  const headers = getAuthHeaders();
  if (!headers) return null;

  const response = await fetchJSON("/subscription/cart", {
    method: "GET",
    headers,
  });

  return response?.data || null;
};

export const addSubscription = async (packageId) => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Chưa đăng nhập");

  return await fetchJSON("/subscription/cart", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ packageId }),
  });
};

export const removeSubscription = async () => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Chưa đăng nhập");

  return await fetchJSON("/subscription/cart", {
    method: "DELETE",
    headers,
  });
};
