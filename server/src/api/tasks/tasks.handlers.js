import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  getTasksByStatus,
  updateTask,
  updateTaskStatus,
} from "./tasks.services.js";

export const handleGetAllTasks = async (req, res) => {
  try {
    const result = await getAllTasks();

    const tasks = result.map((item) => {
      return {
        task_id: item.task_id,
        author: `${item.firstname} ${item.lastname}`,
        title: item.title,
        content: item.content,
        order_id: item.order_id,
        status_id: item.status_id,
      };
    });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleGetTask = async (req, res) => {
  try {
    const parsedId = parseInt(req.params.task_id);

    const result = await getTask(parsedId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleGetTasksByStatus = async (req, res) => {
  try {
    const status_id = parseInt(req.query.status_id);

    const result = await getTasksByStatus(status_id);

    const tasks = result.map((item) => {
      return {
        task_id: item.task_id,
        author: `${item.firstname} ${item.lastname}`,
        title: item.title,
        content: item.content,
        status_id: item.status_id,
      };
    });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleCreateTask = async (req, res) => {
  const { user_id, title, content, status_id } = req.body;

  if (!user_id || !title || !content || !status_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    await createTask(user_id, title, content, status_id);

    return res.status(201).json({
      success: true,
      message: "Added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleUpdateTask = async (req, res) => {
  const { title, content, status_id, old_status_id } = req.body;

  if (!title || !content || !status_id || !old_status_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const parsedId = parseInt(req.params.task_id);

    await updateTask(parsedId, title, content, status_id, old_status_id);

    return res.status(201).json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleUpdateTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const parsedId = parseInt(req.params.task_id);

    await updateTaskStatus(parsedId, status);

    return res.status(201).json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleDeleteTask = async (req, res) => {
  try {
    const parsedId = parseInt(req.params.task_id);

    await deleteTask(parsedId);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};
