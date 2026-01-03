const activityService = require('../service/activityService');

const addActivities = async (req, res) => {
  const { stopId } = req.params;
  const activities = req.body; // array

  try {
    const stop = await activityService.addActivitiesToStop(stopId, req.user.id, activities);
    res.status(200).json({
      success: true,
      message: 'Activities added',
      data: stop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { stopId } = req.params;
  const { orderedActivityIds } = req.body;

  try {
    const stop = await activityService.updateActivityOrder(stopId, req.user.id, orderedActivityIds);
    res.status(200).json({
      success: true,
      message: 'Order updated',
      data: stop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { addActivities, updateOrder };