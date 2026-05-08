import API from "./api";

const taskService = {
  getMyTasks: async () => {
    const response = await API.get("/api/tasks");
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await API.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },
};

export default taskService;
