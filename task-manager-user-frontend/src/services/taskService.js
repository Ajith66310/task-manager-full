import API from "./api";

const taskService = {
  getMyTasks: async () => {
    const response = await API.get("/tasks");
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },
};

export default taskService;
