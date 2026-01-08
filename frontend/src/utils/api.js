import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = () => apiClient.get("/products");
export const addProduct = (product) => apiClient.post("/products", product);
export const updateProduct = (id, product) =>
  apiClient.put(`/products/${id}`, product);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const getSalesData = (filters) =>
  apiClient.get("/sales", { params: filters });
export const uploadSalesCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/sales/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getForecast = (params) => apiClient.get("/forecast", { params });
export const generateForecast = (config) =>
  apiClient.post("/forecast/generate", config);
export const getAIAnalysis = (params) =>
  apiClient.get("/forecast/analysis", { params });

export const generateReport = (config) =>
  apiClient.post("/reports/generate", config);

export default apiClient;
