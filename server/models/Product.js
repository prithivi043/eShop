const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // Automatically calculated
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  stock: { type: Boolean, default: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Automatically calculate discount percentage before saving
productSchema.pre("save", function (next) {
  if (this.price && this.discountPrice) {
    const discountValue = ((this.price - this.discountPrice) / this.price) * 100;
    this.discount = Math.round(discountValue); // Rounded to nearest integer
  } else {
    this.discount = 0;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
