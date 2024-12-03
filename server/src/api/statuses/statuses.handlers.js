import { getStatuses } from "./statuses.services.js";

export const handleGetStatuses = async (req, res) => {
  try {
    const statuses = await getStatuses();

    return res.status(200).send(statuses);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};
