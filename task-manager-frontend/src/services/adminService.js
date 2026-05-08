import API from "./api";

const adminService = {
  getUsers: async () => {
    const response = await API.get("/admin/users");
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await API.patch(`/admin/users/${id}/verify`);
    return response.data;
  },

  assignTask: async (taskData) => {
    const response = await API.post("/admin/tasks/assign", taskData);
    return response.data;
  },

  getPendingTasks: async () => {
    const response = await API.get("/admin/tasks/pending");
    return response.data;
  },

  verifyTask: async (id) => {
    const response = await API.patch(`/admin/tasks/${id}/verify`);
    return response.data;
  },
};

export default adminService;
