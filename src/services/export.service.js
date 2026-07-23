const ExcelJS = require("exceljs");
const Order = require("../models/order.model");

const buildOrderFilter = ({ status, paymentStatus, paymentMethod, startDate, endDate }) => {
  const filter = {};

  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  return filter;
};

const EXPORT_COLUMNS = [
  { header: "Order ID", key: "orderId", width: 26 },
  { header: "Customer Username", key: "customerUsername", width: 24 },
  { header: "Customer Email", key: "customerEmail", width: 28 },
  { header: "Status", key: "status", width: 14 },
  { header: "Payment Method", key: "paymentMethod", width: 16 },
  { header: "Payment Status", key: "paymentStatus", width: 16 },
  { header: "Items Count", key: "itemsCount", width: 12 },
  { header: "Subtotal", key: "subtotal", width: 12 },
  { header: "Shipping Fee", key: "shippingFee", width: 14 },
  { header: "Tax", key: "tax", width: 10 },
  { header: "Discount", key: "discount", width: 12 },
  { header: "Total Price", key: "totalPrice", width: 14 },
  { header: "Created At", key: "createdAt", width: 22 },
  { header: "Paid At", key: "paidAt", width: 22 },
  { header: "Delivered At", key: "deliveredAt", width: 22 },
];

const toRow = (order) => ({
  orderId: order._id.toString(),
  customerUsername: order.user?.username || "N/A",
  customerEmail: order.user?.email || "N/A",
  status: order.status,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: order.subtotal,
  shippingFee: order.shippingFee,
  tax: order.tax,
  discount: order.discount,
  totalPrice: order.totalPrice,
  createdAt: order.createdAt ? order.createdAt.toISOString() : "",
  paidAt: order.paidAt ? order.paidAt.toISOString() : "",
  deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : "",
});

const getOrderRowsForExport = async (filters) => {
  const filter = buildOrderFilter(filters);

  const orders = await Order.find(filter)
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  return orders.map(toRow);
};

const escapeCsvValue = (value) => {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const generateOrdersCsv = (rows) => {
  const header = EXPORT_COLUMNS.map((col) => escapeCsvValue(col.header)).join(",");
  const lines = rows.map((row) =>
    EXPORT_COLUMNS.map((col) => escapeCsvValue(row[col.key])).join(",")
  );

  return "\uFEFF" + [header, ...lines].join("\n");
};

const generateOrdersXlsx = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ecommerce API";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Orders");
  sheet.columns = EXPORT_COLUMNS;
  sheet.getRow(1).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));

  return workbook.xlsx.writeBuffer();
};

module.exports = {
  buildOrderFilter,
  getOrderRowsForExport,
  generateOrdersCsv,
  generateOrdersXlsx,
};
