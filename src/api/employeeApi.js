import apiClient from "./client";

// GET /api/employees -- list (matches backend's pagination/search/filter/sort support;
// we just fetch a generous page size since this is a simple listing page)
export const fetchEmployees = async () => {
  const { data } = await apiClient.get("/employees", {
    params: { limit: 1000 },
  });
  // Backend list endpoint shape: { data: [...employees], pagination: {...} }
  return data.data ?? data;
};

// POST /api/employees -- create
export const createEmployee = async (payload) => {
  const { data } = await apiClient.post("/employees", payload);
  return data;
};

// GET /api/departments -- used to populate the department <select> in the form
export const fetchDepartments = async () => {
  const { data } = await apiClient.get("/departments");
  return data.data ?? data;
};
