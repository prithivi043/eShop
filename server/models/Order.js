const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ type: String }],
  totalAmount: Number,
  customerName: String,
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);
