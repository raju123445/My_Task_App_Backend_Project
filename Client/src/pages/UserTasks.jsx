import { useEffect, useState } from 'react';
import { useTaskStore } from '../context/taskStore';

const UserTasks = () => {
  const { tasks, fetchTasks, updateTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleAddComment = async (taskId) => {
    if (comment.trim()) {
      await useTaskStore.getState().addComment(taskId, comment);
      setComment('');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'on-hold': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your assigned tasks
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'in-progress', 'completed', 'on-hold'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Tasks</h2>
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${
                    selectedTask?._id === task._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-gray-700'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300 py-8">
              No tasks found
            </p>
          )}
        </div>

        {/* Task Details */}
        {selectedTask ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedTask.title}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedTask.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</p>
                  <p className={`mt-1 px-2 py-1 rounded text-xs font-semibold w-fit ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white">
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned By</p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white">
                    {selectedTask.assignedBy?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white">
                    {new Date(selectedTask.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'in-progress', 'completed', 'on-hold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedTask._id, status)}
                      className={`px-3 py-2 rounded text-sm font-medium transition duration-200 capitalize ${
                        selectedTask.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Comments</h3>

              {/* Comments List */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {selectedTask.comments && selectedTask.comments.length > 0 ? (
                  selectedTask.comments.map((c, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {c.userId?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{c.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No comments yet</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment(selectedTask._id);
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleAddComment(selectedTask._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center">
            <p className="text-center text-gray-600 dark:text-gray-300">
              Select a task to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTasks;
