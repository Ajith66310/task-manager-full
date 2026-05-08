import API from "./api";

const adminService = {
  getUsers: async () => {
    const response = await API.get("/api/admin/users");
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await API.patch(`/api/admin/users/${id}/verify`);
    return response.data;
  },

  assignTask: async (taskData) => {
    const response = await API.post("/api/admin/tasks/assign", taskData);
    return response.data;
  },

  getPendingTasks: async () => {
    const response = await API.get("/api/admin/tasks/pending");
    return response.data;
  },

  verifyTask: async (id) => {
    const response = await API.patch(`/api/admin/tasks/${id}/verify`);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await API.delete(`/api/admin/users/${id}`);
    return response.data;
  },
};

export default adminService;
