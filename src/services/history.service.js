// Helper function to add a history record to an order
const addOrderHistory = async (order, status, changedBy = null, note = "") => {
  order.history.push({
    status,
    changedAt: new Date(),
    changedBy: changedBy || null,
    note,
  });
};

module.exports = {
  addOrderHistory,
};
