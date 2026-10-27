import { apiRequest } from './api';

export const taskService = {
  /**
   * Fetch all tasks with optional query filters
   * @param {Object} params - { search, status, priority, sortBy, order }
   */
  async getTasks(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params.priority && params.priority !== 'all') searchParams.append('priority', params.priority);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.order) searchParams.append('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return apiRequest(endpoint, { method: 'GET' });
  },

  /**
   * Get single task by ID
   */
  async getTaskById(id) {
    return apiRequest(`/tasks/${id}`, { method: 'GET' });
  },

  /**
   * Create new task
   */
  async createTask(taskData) {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * Update task fields (PATCH)
   */
  async updateTask(id, updateData) {
    return apiRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  },

  /**
   * Delete task by ID (204 No Content)
   */
  async deleteTask(id) {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get dashboard summary stats
   */
  async getTaskStats() {
    return apiRequest('/tasks/stats/summary', { method: 'GET' });
  }
};
