const asyncHandler = require("express-async-handler");
const exportService = require("../services/export.service");

const exportOrders = asyncHandler(async (req, res) => {
  const { format, status, paymentStatus, paymentMethod, startDate, endDate } =
    req.validatedData;

  const rows = await exportService.getOrderRowsForExport({
    status,
    paymentStatus,
    paymentMethod,
    startDate,
    endDate,
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `orders-export-${timestamp}.${format}`;

  if (format === "xlsx") {
    const buffer = await exportService.generateOrdersXlsx(rows);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(Buffer.from(buffer));
  }

  const csv = exportService.generateOrdersCsv(rows);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
});

module.exports = {
  exportOrders,
};
