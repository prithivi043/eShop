module.exports = (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  if (!name || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Stock must be a non-negative number' });
  }
  next();
};
