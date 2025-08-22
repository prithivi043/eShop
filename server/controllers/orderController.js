const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount, status } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const order = new Order({
      customerName,
      customerEmail,
      items,
      totalAmount,
      status: status || 'Pending',
    });

    await order.save();

    res.status(201).json({ message: 'Order Created', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const filters = req.query;
    console.log("Received filters:", filters);
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.customer) query.customerName = new RegExp(filters.customer, 'i');
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


