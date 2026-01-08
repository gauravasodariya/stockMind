let products = [
  {
    id: 1,
    name: "Classic Oxford Shirt",
    sku: "SKU-10294",
    category: "Apparel",
    price: 45,
    stock: 450,
    forecast: "Stable",
  },
  {
    id: 2,
    name: "Leather Messenger Bag",
    sku: "SKU-55201",
    category: "Accessories",
    price: 129,
    stock: 12,
    forecast: "High Demand",
  },
];

export const getAllProducts = (req, res) => {
  res.json(products);
};

export const getProductById = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

export const createProduct = (req, res) => {
  const { name, sku, category, price, stock } = req.body;

  if (!name || !sku || !category || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product = {
    id: Math.max(...products.map((p) => p.id), 0) + 1,
    name,
    sku,
    category,
    price: parseFloat(price),
    stock: parseInt(stock) || 0,
    forecast: "Unknown",
    createdAt: new Date(),
  };

  products.push(product);
  res.status(201).json(product);
};

export const updateProduct = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });

  Object.assign(product, req.body, { updatedAt: new Date() });
  res.json(product);
};

export const deleteProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", data: deleted[0] });
};
